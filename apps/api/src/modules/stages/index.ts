import { authPlugin } from "@/plugins/auth.js";
import { Elysia } from "elysia";

export const stagesRoute = new Elysia()
	.use(authPlugin)
	.get("/:id", () => {})
	.get("/", () => {})
	.post("/", () => {}, {
		isAuth: true,
	})
	.patch("/:id", () => {}, {
		isAuth: true,
	})
	.delete("/:id", () => {}, {
		isAuth: true,
	});
