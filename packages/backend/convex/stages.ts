import { defineTable } from "convex/server";
import { mutation } from "./_generated/server";
import { throwIfNotLoggedIn } from "./utils/auth";
import { v } from "convex/values";

export const stageTables = {
	stages: defineTable({
		title: v.string(),
		description: v.string(),
		breifing: v.string(),
		designer: v.id("users"),
		papers: v.number(),
		noShoots: v.number(),
		poppers: v.number(),
		walkthroughTime: v.number(), // in minutes
	}),
};
