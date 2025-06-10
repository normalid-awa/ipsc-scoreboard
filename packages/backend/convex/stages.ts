import { defineTable } from "convex/server";
import { mutation } from "./_generated/server";
import { throwIfNotLoggedIn } from "./utils/auth";
import { v } from "convex/values";

const stageDto = {
	title: v.string(),
	description: v.string(),
	breifing: v.string(),
	designer: v.id("users"),
	papers: v.number(),
	noShoots: v.number(),
	poppers: v.number(),
	walkthroughTime: v.number(), // in minutes
};

export const stageTables = {
	stages: defineTable(stageDto),
};

export const createStage = mutation({
	args: {
		...stageDto,
	},
	returns: v.id("stages"),
	async handler(ctx, args) {
		throwIfNotLoggedIn(ctx);
		return await ctx.db.insert("stages", { ...args });
	},
});
