import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { stageTables } from "./stages";

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	...authTables,
	...stageTables,
});
