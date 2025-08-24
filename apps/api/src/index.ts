import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth/auth.js";
import orm from "./database/orm.js";
import authApp from "./auth/api.js";
import { createServer } from "node:https";
import { readFileSync } from "node:fs";

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
});

app.use(
	"*", // or replace with "*" to enable cors for all routes
	cors({
		origin: process.env.FRONTEND_URL || "", // replace with your origin
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

app.route("/auth", authApp);

app.get("/hello", (c) => {
	return c.text(`Hello Hono! ${c.var.user?.id}`);
});

app.get("/redirect", (c) => {
	console.log(c.req.query("to"));
	return c.redirect(c.req.query("to") || "/");
});

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
