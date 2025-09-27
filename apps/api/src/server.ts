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
import { serve } from "@hono/node-server";
import { createServer } from "node:https";
import { readFileSync } from "node:fs";

export const app = new Elysia({
	adapter: node(),
	prefix: "/api",
})
	.use(
		cors({
			origin: env.FRONTEND_URL,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization", "Credentials"],
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
	.compile();

serve({
	fetch: app.fetch,
	port: 3001,
	createServer,
	serverOptions: {
		cert: readFileSync("../../cert.pem"),
		key: readFileSync("../../key.pem"),
	},
});

export type Context = InferContext<typeof app>;
