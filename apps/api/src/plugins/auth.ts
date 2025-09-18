import { Elysia } from "elysia";
import auth from "../auth.js";

export const authPlugin = new Elysia({ name: "auth" }).macro({
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
});
