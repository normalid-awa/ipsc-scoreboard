import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

export const getAuthUserInfo = query({
	handler: async (ctx): Promise<{ avatar: string; name: string }> => {
		const id = await ctx.auth.getUserIdentity();
		if (!id)
			return {
				avatar: "",
				name: "Guest",
			};

		const data = (
			await ctx.db
				.query("users")
				.filter((q) => q.eq(q.field("_id"), id.subject.split("|")[0]))
				.take(1)
		)[0];

		return {
			avatar: data.image || "",
			name: data.name || "Unknown",
		};
	},
});
