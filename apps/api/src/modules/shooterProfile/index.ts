import { ShooterProfile } from "@/database/entities/shooterProfile.entity.js";
import { User } from "@/database/entities/user.entity.js";
import { authPlugin } from "@/plugins/auth.js";
import { ormPlugin } from "@/plugins/orm.js";
import { Sport } from "@/sport.js";
import {
	paginationDto,
	parsePaginationParams,
	serializePaginationResult,
} from "@/util/pagination.js";
import "@/util/queryFilter.js";
import { convertQueryFilter, QueryFilter } from "@/util/queryFilter.js";
import { wrap } from "@mikro-orm/core";
import { Elysia, status, t } from "elysia";

const createShooterDto = t.Object({
	identifier: t.String(),
	sport: t.Enum(Sport),
});

export const shooterProfileRoute = new Elysia({
	prefix: "/shooter-profile",
})
	.use(ormPlugin)
	.use(authPlugin)
	.get(
		"/",
		async ({ orm, query }) => {
			const shooterProfiles = await orm.em.findByCursor(
				ShooterProfile,
				convertQueryFilter<ShooterProfile>(query.filter),
				parsePaginationParams(query.pagination),
			);
			return serializePaginationResult(shooterProfiles);
		},
		{
			query: t.Object({
				pagination: paginationDto(["id"]),
				filter: QueryFilter,
			}),
		},
	)
	.get(
		"/:id",
		async ({ orm, params: { id } }) => {
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
		async ({ orm, user, body }) => {
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
			shooterProfile.user = orm.em.getReference(User, user.id);
			await orm.em.persist(shooterProfile).flush();
			return shooterProfile;
		},
		{
			isAuth: true,
			body: createShooterDto,
		},
	)
	.put(
		"/:id",
		async ({ orm, user, params, body }) => {
			const isAvailable =
				(await orm.em.count(ShooterProfile, {
					$or: [
						{
							$and: [
								{ sport: body.sport },
								{ identifier: body.identifier },
							],
						},
						{
							$and: [
								{ user: user.id },
								{ sport: body.sport },
								{ id: { $ne: params.id } },
							],
						},
					],
				})) > 0;
			if (isAvailable)
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
			wrap(shooterProfile).assign(body);
			await orm.em.flush();
			return shooterProfile;
		},
		{
			isAuth: true,
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
			body: createShooterDto,
		},
	)
	.delete(
		"/:id",
		async ({ orm, user, params }) => {
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
			isAuth: true,
			params: t.Object({ id: t.Numeric({ minimum: 1 }) }),
		},
	);
