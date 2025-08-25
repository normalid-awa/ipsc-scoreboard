import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./apps/auth/auth.js";
import orm from "./database/orm.js";
import authApp from "./apps/auth/auth.app.js";
import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import env from "./env.js";

type Variables = {
	orm: typeof orm;
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};

const app = new Hono<{
	Variables: Variables;
}>().basePath("/api");

app.use("*", (c, next) => {
	c.set("orm", orm);
	return next();
})
	.use(
		"*", // or replace with "*" to enable cors for all routes
		cors({
			origin: process.env.FRONTEND_URL || "", // replace with your origin
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["POST", "GET", "OPTIONS"],
			exposeHeaders: ["Content-Length"],
			maxAge: 600,
			credentials: true,
		}),
	)
	.use("*", async (c, next) => {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			c.set("user", null);
			c.set("session", null);
			return next();
		}

		c.set("user", session.user);
		c.set("session", session.session);
		return next();
	});

const routes = app.route("/auth", authApp).get(
	"/redirect",
	zValidator(
		"query",
		z.object({
			to: z.string().url().includes(env.FRONTEND_URL),
		}),
	),
	(c) => {
		return c.redirect(c.req.query("to") || "/");
	},
);

serve(
	{
		fetch: app.fetch,
		hostname: "0.0.0.0",
		port: 3001,
		createServer,
		serverOptions: {
			key: readFileSync("../../key.pem"),
			cert: readFileSync("../../cert.pem"),
		},
	},
	(info) => {
		console.log(`Server is running on http://${info.address}:${info.port}`);
	},
);

export default app;
export type AppType = typeof routes;
