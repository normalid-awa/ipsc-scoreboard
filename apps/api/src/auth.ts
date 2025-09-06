import { betterAuth, BetterAuthOptions } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import {
	emailOTP,
	multiSession,
	organization,
	openAPI,
} from "better-auth/plugins";
import nodemailer from "nodemailer";
import { mikroOrmAdapter } from "better-auth-mikro-orm";
import { readFile } from "fs/promises";
import path from "path";
import orm from "./database/orm.js";
import env from "./env.js";

let emailVerificationHtmlTemplate: string;
let passwordResetVerificationCodeHtmlTemplate: string;

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST as string,
	port: parseInt(process.env.SMTP_PORT as string),
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER as string,
		pass: process.env.SMTP_PASSWORD as string,
	},
});

const authConfig = {
	database: mikroOrmAdapter(orm),
	basePath: "/auth",
	logger: {
		level: process.env.NODE_ENV === "development" ? "debug" : "warn",
	},
	trustedOrigins: [env.FRONTEND_URL],
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false,
		},
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
				from: process.env.SMTP_EMAIL_VERIFY_FROM as string,
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
			clientId: process.env.AUTH_GITHUB_ID as string,
			clientSecret: process.env.AUTH_GITHUB_SECRET as string,
			redirectURI: `${env.FRONTEND_URL}/api/auth/callback/github`,
		},
		google: {
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
			redirectURI: `${env.FRONTEND_URL}/api/auth/callback/google`,
		},
		microsoft: {
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID as string,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET as string,
			tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER as string,
			redirectURI: `${env.FRONTEND_URL}/api/auth/callback/microsoft`,
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
					from: process.env.SMTP_EMAIL_VERIFY_FROM as string,
					to: email,
					subject: subject,
					text: subject,
					html: html,
				});
				console.log(info);
			},
		}),
		multiSession(),
		organization({
			allowUserToCreateOrganization: true,
		}),
		openAPI(),
		reactStartCookies(),
	],
} satisfies BetterAuthOptions;

export default betterAuth(authConfig) as ReturnType<
	typeof betterAuth<typeof authConfig>
>;
