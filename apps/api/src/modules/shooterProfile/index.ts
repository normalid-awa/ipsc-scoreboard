import { authPlugin, ormPlugin } from "@/plugins.js";
import { Elysia } from "elysia";

export const shooterProfileRoute = new Elysia({
	prefix: "/shooter-profile",
})
	.use(ormPlugin)
	.use(authPlugin)
	.post("/", () => "eqweqw", { isAuth: true });
