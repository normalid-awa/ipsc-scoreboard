import { GenericMutationCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";
import { ConvexError } from "convex/values";
import { AppError, AppErrorCode } from "./errorType";

export async function getUserIdFromCtx(ctx: GenericMutationCtx<DataModel>) {
	return (await ctx.auth.getUserIdentity())?.subject.split("|")[0];
}

export async function isLoggedIn(
	ctx: GenericMutationCtx<DataModel>,
): Promise<boolean> {
	const identity = await ctx.auth.getUserIdentity();
	if (identity) {
		if (
			await ctx.db
				.query("users")
				.filter((v) =>
					v.eq(v.field("_id"), identity.subject.split("|")[0]),
				)
				.first()
		)
			return true;
	}
	return false;
}

export async function throwIfNotLoggedIn(
	ctx: GenericMutationCtx<DataModel>,
): Promise<void> {
	if (!(await isLoggedIn(ctx))) {
		throw new ConvexError({
			message: "User is not logged in",
			code: AppErrorCode.Unauthorized,
		} satisfies AppError);
	}
}
