import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from "@elysiajs/cors";
import orm from "./database/orm.js";
import { RequestContext, Utils, wrap } from "@mikro-orm/core";
import auth from "./auth.js";
import env from "./env.js";

export const app = new Elysia({
	adapter: node(),
})
	.decorate("orm", orm)
	.on("beforeHandle", () => RequestContext.enter(orm.em))
	.on("afterHandle", ({ response }) =>
		Utils.isEntity(response) ? wrap(response).toObject() : response,
	)
	///#region BetterAuth
	.use(
		cors({
			origin: env.FRONTEND_URL,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.mount(auth.handler)
	.macro({
		isAuth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return status(401);

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	})
	.get("/hello", () => "Hello World")
	///#endregion
	.listen(3001, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
