import { Elysia } from "elysia";
import auth from "../auth.js";
import orm from "@/database/orm.js";
import { User } from "@/database/entities/user.entity.js";

export const authPlugin = new Elysia({ name: "auth" }).macro({
	isAuth: {
		async resolve({ status, request: { headers } }) {
			if (process.env.TESTING === "1") {
				const user = new User();
				user.email = "mockingauser@mock.com";
				user.name = "Mock User";
				user.emailVerified = true;
				await orm.em.fork().persistAndFlush(user);

				return {
					session: {
						id: user.id,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
						expiresAt: new Date(Date.now() + 3600000),
						userId: user.id,
						token: "",
					},
					user: {
						createdAt: user.createdAt,
						email: user.email,
						emailVerified: user.emailVerified,
						id: user.id,
						image: user.image,
						name: user.name,
						updatedAt: user.updatedAt,
					},
				} satisfies Partial<
					Awaited<ReturnType<typeof auth.api.getSession>>
				>;
			}

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
