import { mutation } from "./_generated/server";
import { throwIfNotLoggedIn } from "./utils/auth";

export const generateUploadUrl = mutation({
	handler: async (ctx) => {
		throwIfNotLoggedIn(ctx);
		return await ctx.storage.generateUploadUrl();
	},
});
