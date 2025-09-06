import { ShooterProfile } from "@/database/entities/shooterProfile.entity.js";
import { User } from "@/database/entities/user.entity.js";
import { authPlugin, ormPlugin } from "@/plugins.js";
import { Sport } from "@/sport.js";
import { Elysia, t } from "elysia";

export const shooterProfileRoute = new Elysia({
	prefix: "/shooter-profile",
})
	.use(ormPlugin)
	.use(authPlugin)
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
