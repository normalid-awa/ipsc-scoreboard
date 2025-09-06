import { Elysia } from "elysia";
import orm from "./database/orm.js";
import auth from "./auth.js";

export const ormPlugin = new Elysia({ name: "orm" }).decorate("orm", orm);

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
