import { zValidator } from "@hono/zod-validator";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import z from "zod";
import { APIReturn } from "../types.js";

export const validateAuth = zValidator(
	"cookie",
	z.object({
		"__Secure-ipsc-scoreboard.session_token": z.string(),
	}),
	(res, c) => {
		if (!res.success) {
			c.status(StatusCodes.UNAUTHORIZED);
			return c.json({
				code: StatusCodes.UNAUTHORIZED,
				data: null,
				error: [
					{
						code: StatusCodes.UNAUTHORIZED,
						message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
						details: res.error.message,
					},
				],
			} satisfies APIReturn<null>);
		}
	},
);
