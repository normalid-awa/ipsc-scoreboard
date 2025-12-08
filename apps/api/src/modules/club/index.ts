import {
	Club,
	JoinClubRequest,
	ThirdPartyPlatform,
} from "@/database/entities/club.entity.js";
import { Image } from "@/database/entities/image.entity.js";
import { ShooterProfile } from "@/database/entities/shooterProfile.entity.js";
import { User } from "@/database/entities/user.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import {
	OffsetBasedPaginationSchema,
	parseOffsetBasedPaginationParams,
	serializeOffsetBasedPaginationResult,
} from "@/util/offsetBasedPagination.js";
import { convertQueryFilter, QueryFilter } from "@/util/queryFilter.js";
import { rel } from "@mikro-orm/core";
import { Elysia, status, t } from "elysia";

export const createClubDto = t.Object({
	name: t.String(),
	description: t.Optional(t.String()),
	thirdPartyLinks: t.Optional(
		t.Array(
			t.Object({
				platform: t.Enum(ThirdPartyPlatform),
				link: t.String({ format: "uri" }),
			}),
		),
	),
	icon: t.File({ type: "image/*" }),
	banner: t.Optional(t.File({ type: "image/*" })),
});

export const clubRoute = new Elysia({ prefix: "/club" })
	.use(authPlugin)
	//#region Read
	.get(
		"/",
		async ({ query }) => {
			const [clubs, totalCount] = await orm.em.findAndCount(
				Club,
				convertQueryFilter<Club>(query.filter),
				{
					...parseOffsetBasedPaginationParams(query.pagination),
					exclude: ["pendingRequests"],
				},
			);
			return serializeOffsetBasedPaginationResult(
				clubs,
				totalCount,
				query.pagination,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, user }) => {
			const club = await orm.em.findOne(
				Club,
				{
					id,
				},
				{
					populate: ["admins:ref"],
				},
			);
			if (!club) return status(404);
			let shouldPopulatePendingRequests = false;
			if (user) {
				if (club.owner.id == user.id) {
					shouldPopulatePendingRequests = true;
				} else if (club.admins.exists((i) => i.id == user.id)) {
					shouldPopulatePendingRequests = true;
				}
			}
			if (shouldPopulatePendingRequests) {
				await club.pendingRequests.init();
			}
			return club;
		},
		{
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
			isAuth: true,
		},
	)
	//#endregion
	//create club
	.post(
		"/",
		async ({ user, body }) => {
			const userManagedClub = await orm.em.count(Club, {
				$or: [
					{
						owner: {
							id: user.id,
						},
					},
					{
						admins: {
							$some: {
								id: user.id,
							},
						},
					},
				],
			});
			if (userManagedClub > 0) {
				return status(
					409,
					"Conflict: You should not manage other club while creating another club",
				);
			}

			const club = new Club();
			club.name = body.name;
			club.description = body.description;
			club.thirdPartyLinks = body.thirdPartyLinks ?? [];
			club.owner = rel(User, user.id);

			const icon = new Image();
			await icon.upload(body.icon, rel(User, user.id));
			orm.em.persist(icon);
			club.icon = icon;

			if (body.banner) {
				const banner = new Image();
				await banner.upload(body.banner, rel(User, user.id));
				orm.em.persist(banner);
				club.banner = banner;
			}

			orm.em.persist(club);
			await orm.em.flush();
			return club;
		},
		{
			requiredAuth: true,
			body: createClubDto,
		},
	)
	//request joining a club
	.post(
		"/join/:id",
		async ({
			params: { id: clubId },
			body: { shooterProfileId },
			user: { id: userId },
		}) => {
			const shooterProfile = await orm.em.findOne(ShooterProfile, {
				id: shooterProfileId,
			});
			if (!shooterProfile) return status(404);
			if (shooterProfile.user?.id != userId) return status(403);

			const isShooterProfileInOtherClub =
				(await orm.em.count(Club, {
					members: {
						$some: {
							id: shooterProfileId,
						},
					},
				})) > 0;
			if (isShooterProfileInOtherClub)
				return status(
					409,
					"Conflict: The shooter profile has already been in other club",
				);

			const club = await orm.em.findOne(
				Club,
				{ id: clubId },
				{ populate: ["members:ref", "pendingRequests"] },
			);
			if (!club) return status(404);
			if (club.members.exists((m) => m.id == shooterProfileId))
				return status(
					409,
					"Conflict: Shooter profile has been in this club",
				);

			if (
				club.pendingRequests.exists(
					(r) => r.from.id == shooterProfileId,
				)
			)
				return status(
					409,
					"Conflict: You've already requested to join this club",
				);

			const request = new JoinClubRequest();
			request.from = rel(ShooterProfile, shooterProfileId);
			club.pendingRequests.add(request);
			await orm.em.flush();
			return request;
		},
		{
			requiredAuth: true,
			params: t.Object({
				id: t.Integer(),
			}),
			body: t.Object({
				shooterProfileId: t.Integer(),
			}),
		},
	)
	//accept request
	.post(
		"/accept/:requestId",
		async ({ params: { requestId }, user: { id: userId } }) => {
			const request = await orm.em.findOne(
				JoinClubRequest,
				{
					uuid: requestId,
				},
				{
					populate: ["club", "club.admins", "from"],
				},
			);
			if (!request) return status(404);
			if (
				!(
					request.club.owner.id == userId ||
					request.club.admins.exists((a) => a.id == userId)
				)
			)
				return status(403);

			request.club.members.add(request.from);
			orm.em.flush();
			orm.em.removeAndFlush(request);
			return status(204);
		},
		{
			requiredAuth: true,
			params: t.Object({ requestId: t.String({ format: "uuid" }) }),
		},
	)
	.delete(
		"/:id",
		async ({ user, params: { id } }) => {
			const club = await orm.em.findOne(Club, {
				id,
			});
			if (!club) return status(404);
			if (club.owner.id != user.id)
				return status(403, "You are not the owner of the club");
			await orm.em.removeAndFlush(club);
			return status(204);
		},
		{
			requiredAuth: true,
			params: t.Object({
				id: t.Number(),
			}),
		},
	);
