import { createEnv } from "@t3-oss/env-core";
import z from "zod";

const env = createEnv({
	server: {
		FRONTEND_URL: z.string().url(),

		BETTER_AUTH_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string(),

		DATABASE_URL: z.string().url(),

		AUTH_GITHUB_ID: z.string(),
		AUTH_GITHUB_SECRET: z.string(),
		AUTH_GOOGLE_ID: z.string(),
		AUTH_GOOGLE_SECRET: z.string(),
		AUTH_DISCORD_ID: z.string(),
		AUTH_DISCORD_SECRET: z.string(),
		AUTH_MICROSOFT_ENTRA_ID_ID: z.string(),
		AUTH_MICROSOFT_ENTRA_ID_ISSUER: z.string(),
		AUTH_MICROSOFT_ENTRA_ID_SECRET: z.string(),

		SMTP_HOST: z.string(),
		SMTP_PORT: z.coerce.number(),
		SMTP_USER: z.string(),
		SMTP_PASSWORD: z.string(),
		SMTP_EMAIL_VERIFY_FROM: z.string(),
	},
	runtimeEnv: process.env,
});

export default env;
