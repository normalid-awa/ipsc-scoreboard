import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import db from "../db/db";
import * as authSchema from "@/db/schema/auth-schema";
import {
	emailOTP,
	multiSession,
	username,
	organization,
} from "better-auth/plugins";
import nodemailer from "nodemailer";

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
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }, request) => {
			if (!emailVerificationHtmlTemplate)
				emailVerificationHtmlTemplate = (
					await import(`@/email/template/verificationEmailTemplate.html?raw`)
				).default;

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
	plugins: [
		reactStartCookies(),
		username(),
		emailOTP({
			expiresIn: 5 * 60,
			async sendVerificationOTP({ email, otp, type }) {
				if (!emailVerificationHtmlTemplate)
					passwordResetVerificationCodeHtmlTemplate = (
						await import(
							`@/email/template/passwordResetVerificationCode.html?raw`
						)
					).default;

				let subject = "";
				let html = ";";

				switch (type) {
					case "forget-password":
						subject = "Password reset verification code";
						html = passwordResetVerificationCodeHtmlTemplate.replace(
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
	],
});
