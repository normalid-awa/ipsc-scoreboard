import { Club, ThirdPartyPlatform } from "@/database/entities/club.entity.js";
import { Image } from "@/database/entities/image.entity.js";
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
				parseOffsetBasedPaginationParams(query.pagination),
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
		async ({ params: { id } }) => {
			const club = await orm.em.findOne(Club, {
				id,
			});
			if (!club) return status(404);
			return club;
		},
		{
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
		},
	)
	//#endregion
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
			isAuth: true,
			body: createClubDto,
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
			isAuth: true,
			params: t.Object({
				id: t.Number(),
			}),
		},
	);
