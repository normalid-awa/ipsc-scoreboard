import { ShooterProfile } from "@/database/entities/shooterProfile.entity.js";
import { User } from "@/database/entities/user.entity.js";
import { authPlugin, ormPlugin } from "@/plugins.js";
import { Sport } from "@/sport.js";
import {
	paginationDto,
	parsePaginationParams,
	serializePaginationResult,
} from "@/util/pagination.js";
import { Elysia, status, t } from "elysia";

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
				{},
				parsePaginationParams(query),
			);
			return serializePaginationResult(shooterProfiles);
		},
		{
			query: t.Object({
				...paginationDto(["id"]),
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
		({ orm, user, body }) => {
			const shooterProfile = new ShooterProfile();
			shooterProfile.identifier = body.identifier;
			shooterProfile.sport = body.sport;
			shooterProfile.user = orm.em.getReference(User, user.id);
			orm.em.persist(shooterProfile).flush();
			return shooterProfile;
		},
		{
			isAuth: true,
			body: t.Object({
				identifier: t.String(),
				sport: t.Enum(Sport),
			}),
		},
	);
