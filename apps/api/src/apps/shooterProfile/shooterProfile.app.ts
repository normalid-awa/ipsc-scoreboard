import { Hono } from "hono";
import { AppContext } from "../../index.js";
import { ShooterProfile } from "./shooterProfile.entity.js";
import { validateAuth } from "../../validator/auth.validator.js";
import { createSuccessfulAPIReturn } from "../../api.type.js";
import { serialize, wrap } from "@mikro-orm/core";

const shooterProfileApp = new Hono<AppContext>().get(
	"/self",
	validateAuth,
	async (c) => {
		const shooterProfiles = await c.var.orm.em.findAll(ShooterProfile, {
			where: {
				user: c.var.user!.id,
			},
			exclude: ["user"],
		});
		return c.json(createSuccessfulAPIReturn(serialize(shooterProfiles)));
	},
);

export default shooterProfileApp;
