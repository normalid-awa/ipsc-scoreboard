import { Image } from "@/database/entities/image.entity.js";
import { ShooterProfile } from "@/database/entities/shooterProfile.entity.js";
import { User } from "@/database/entities/user.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { SportEnum } from "@/sport.js";
import {
	OffsetBasedPaginationSchema,
	parseOffsetBasedPaginationParams,
	serializeOffsetBasedPaginationResult,
} from "@/util/offsetBasedPagination.js";
import "@/util/queryFilter.js";
import { convertQueryFilter, QueryFilter } from "@/util/queryFilter.js";
import { rel, wrap } from "@mikro-orm/core";
import { Elysia, status, t } from "elysia";

const createShooterDto = t.Object({
	identifier: t.String(),
	sport: t.Enum(SportEnum),
	image: t.Optional(
		t.Nullable(
			t.File({
				type: "image",
			}),
		),
	),
});

export const shooterProfilePopulateSchema = t.Array(
	t.UnionEnum(["club"] as const),
);

export const shooterProfileRoute = new Elysia({
	prefix: "/shooter-profile",
})
	.use(authPlugin)
	.get(
		"/",
		async ({ query }) => {
			const [shooterProfiles, totalCount] = await orm.em.findAndCount(
				ShooterProfile,
				convertQueryFilter<ShooterProfile>(query.filter),
				{
					...parseOffsetBasedPaginationParams(query.pagination),
					populate: query.populate,
				},
			);
			return serializeOffsetBasedPaginationResult(
				shooterProfiles,
				totalCount,
				query.pagination,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
				populate: t.Optional(shooterProfilePopulateSchema),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id } }) => {
			const shooterProfile = await orm.em.findOne(ShooterProfile, id);
			if (!shooterProfile) return status(404);
			return shooterProfile;
		},
		{
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
		},
	)
	.post(
		"/",
		async ({ user, body }) => {
			const isAvailable =
				(await orm.em.count(ShooterProfile, {
					user: user.id,
					$or: [
						{
							$and: [
								{ sport: body.sport },
								{ identifier: body.identifier },
							],
						},
						{
							$and: [{ user: user.id }, { sport: body.sport }],
						},
					],
				})) > 0;
			if (isAvailable)
				return status(
					409,
					"Conflict: Each user can only have one profile per sport",
				);
			const shooterProfile = new ShooterProfile();
			shooterProfile.identifier = body.identifier;
			shooterProfile.sport = body.sport;
			shooterProfile.user = rel(User, user.id);
			if (body.image) {
				const image = new Image();
				await image.upload(body.image, rel(User, user.id));
				orm.em.persist(image);
				shooterProfile.image = image;
			}

			orm.em.persist(shooterProfile);
			await orm.em.flush();
			return shooterProfile;
		},
		{
			requiredAuth: true,
			body: createShooterDto,
		},
	)
	.patch(
		"/:id",
		async ({ user, params, body }) => {
			let isAvailable = true;
			if (body.sport) {
				isAvailable =
					(await orm.em.count(ShooterProfile, {
						user: user.id,
						sport: body.sport,
						id: { $ne: params.id },
					})) == 0;
			}
			if (!isAvailable)
				return status(
					409,
					"Conflict: Each user can only have one profile per sport",
				);
			const shooterProfile = await orm.em.findOne(
				ShooterProfile,
				params.id,
			);
			if (!shooterProfile) return status(404);
			if (shooterProfile.user !== orm.em.getReference(User, user.id))
				return status(401);

			if (body.image === null && shooterProfile.image) {
				orm.em.remove(shooterProfile.image);
			} else if (body.image) {
				if (shooterProfile.image) orm.em.remove(shooterProfile.image);
				const image = new Image();
				image.upload(body.image, rel(User, user.id));
				orm.em.persist(image);
				//@ts-ignore
				body.image = image;
			}

			wrap(shooterProfile).assign(body);
			await orm.em.flush();
			return shooterProfile;
		},
		{
			requiredAuth: true,
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
			body: t.Partial(createShooterDto),
		},
	)
	.delete(
		"/:id",
		async ({ user, params }) => {
			const shooterProfile = await orm.em.findOne(
				ShooterProfile,
				params.id,
			);
			if (!shooterProfile) return status(404);
			if (shooterProfile.user !== orm.em.getReference(User, user.id))
				return status(401);
			orm.em.remove(shooterProfile).flush();
			return status(204);
		},
		{
			requiredAuth: true,
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
		},
	);
