import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import db from "./db/db";
import * as authSchema from "@/db/schema/auth-schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: { ...authSchema },
	}),
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false,
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.AUTH_GITHUB_ID as string,
			clientSecret: process.env.AUTH_GITHUB_SECRET as string,
		},
		google: {
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
		},
		microsoft: {
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID as string,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET as string,
			tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER as string,
		},
	},
	plugins: [reactStartCookies()],
});
