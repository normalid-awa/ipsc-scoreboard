import { betterAuth, BetterAuthOptions } from "better-auth";
import { mikroOrmAdapter } from "better-auth-mikro-orm";
import { emailOTP, multiSession, openAPI } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { readFile } from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";
import orm from "./database/orm.js";
import env from "./env.js";

let emailVerificationHtmlTemplate: string;
let passwordResetVerificationCodeHtmlTemplate: string;

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: false, // true for 465, false for other ports
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASSWORD,
	},
});

const authConfig: BetterAuthOptions = {
	database: mikroOrmAdapter(orm),
	basePath: "/auth",
	logger: {
		level: env.NODE_ENV === "production" ? "warn" : "debug",
	},
	trustedOrigins: [env.FRONTEND_URL],
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false,
		},
		database: {
			generateId: false,
		},
		cookiePrefix: "ipsc-scoreboard",
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }, request) => {
			if (!emailVerificationHtmlTemplate)
				emailVerificationHtmlTemplate = (
					await readFile(
						path.join(
							process.cwd(),
							"src/email/template/verificationEmailTemplate.html",
						),
					)
				).toString();

			const info = await transporter.sendMail({
				from: env.SMTP_EMAIL_VERIFY_FROM as string,
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email: ${url}`,
				html: emailVerificationHtmlTemplate.replace(
					"{{verificationLink}}",
					url,
				),
			});
			console.log(info);
		},
	},
	socialProviders: {
		github: {
			clientId: env.AUTH_GITHUB_ID as string,
			clientSecret: env.AUTH_GITHUB_SECRET as string,
			redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
		},
		google: {
			clientId: env.AUTH_GOOGLE_ID as string,
			clientSecret: env.AUTH_GOOGLE_SECRET as string,
			redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
		},
		microsoft: {
			clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID as string,
			clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET as string,
			tenantId: env.AUTH_MICROSOFT_ENTRA_ID_ISSUER as string,
			redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/microsoft`,
		},
	},
	plugins: [
		emailOTP({
			expiresIn: 5 * 60,
			async sendVerificationOTP({ email, otp, type }) {
				if (!emailVerificationHtmlTemplate)
					passwordResetVerificationCodeHtmlTemplate = (
						await readFile(
							path.join(
								process.cwd(),
								"src/email/template/passwordResetVerificationCode.html",
							),
						)
					).toString();

				let subject = "";
				let html = ";";

				switch (type) {
					case "forget-password":
						subject = "Password reset verification code";
						html =
							passwordResetVerificationCodeHtmlTemplate.replace(
								"{{otp}}",
								otp,
							);
						break;
				}

				const info = await transporter.sendMail({
					from: env.SMTP_EMAIL_VERIFY_FROM as string,
					to: email,
					subject: subject,
					text: subject,
					html: html,
				});
				console.log(info);
			},
		}),
		multiSession(),
		openAPI(),
		reactStartCookies(),
	],
} satisfies BetterAuthOptions;

export default betterAuth(authConfig) as ReturnType<
	typeof betterAuth<typeof authConfig>
>;
