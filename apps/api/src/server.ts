import { Elysia, InferContext } from "elysia";
import { node } from "@elysiajs/node";
import { shooterProfileRoute } from "./modules/shooterProfile/index.js";
import { cors } from "@elysiajs/cors";
import env from "./env.js";
import auth from "./auth.js";
import { RequestContext, Utils, wrap } from "@mikro-orm/core";
import orm from "./database/orm.js";
import "./util/queryFilter.js";
import { imageRoute } from "./modules/image/index.js";

export const app = new Elysia({
	adapter: node(),
	prefix: "/api",
})
	.use(
		cors({
			origin: env.FRONTEND_URL,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.get("/ping", () => "pong")
	.on("beforeHandle", () => RequestContext.enter(orm.em))
	.on("afterHandle", ({ response }) => {
		return Utils.isEntity(response) ? wrap(response).toObject() : response;
	})
	.mount(auth.handler)
	.use(shooterProfileRoute)
	.use(imageRoute)
	.listen(3001, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});

export type Context = InferContext<typeof app>;
