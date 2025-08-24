import { Hono } from "hono";
import { auth } from "./auth.js";

const authApp = new Hono();

authApp.on(["POST", "GET"], "*", (c) => {
	return auth.handler(c.req.raw);
});

export default authApp;
