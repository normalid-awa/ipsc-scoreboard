import {
	defineTable,
	paginationOptsValidator,
	PaginationResult,
} from "convex/server";
import { mutation, query } from "./_generated/server";
import { throwIfNotLoggedIn } from "./utils/auth";
import { ConvexError, Infer, v } from "convex/values";
import { AppError, AppErrorCode } from "./utils/errorType";

const stageModel = {
	title: v.string(),
	description: v.string(),
	breifing: v.string(),
	designer: v.id("users"),
	images: v.array(v.id("_storage")),
	papers: v.number(),
	noShoots: v.number(),
	poppers: v.number(),
	walkthroughTime: v.number(), // in minutes
};

const stageDto = v.object({ ...stageModel, imagesUrl: v.array(v.string()) });

export const stageTables = {
	stages: defineTable(stageModel),
};

export const getStage = query({
	args: {
		id: v.id("stages"),
	},
	async handler(ctx, args) {
		const stage = (await ctx.db.get(args.id)) as unknown as Infer<
			typeof stageDto
		>;
		if (!stage) {
			throw new ConvexError({
				code: AppErrorCode.NotFound,
				message: "Stage not found",
			} satisfies AppError);
		}
		stage.imagesUrl = await Promise.all(
			stage.images.map(async (imageId) => {
				return (await ctx.storage.getUrl(imageId)) ?? "";
			}),
		);
		return stage;
	},
});

export const getStages = query({
	args: {
		paginationOpts: paginationOptsValidator,
	},
	async handler(ctx, args) {
		const data = (await ctx.db
			.query("stages")
			.paginate(args.paginationOpts)) as unknown as PaginationResult<
			Infer<typeof stageDto>
		>;
		for (const stage in data.page) {
			data.page[stage].imagesUrl = await Promise.all(
				data.page[stage].images.map(async (imageId) => {
					return (await ctx.storage.getUrl(imageId)) ?? "";
				}),
			);
		}
		return data;
	},
});

export const createStage = mutation({
	args: {
		...stageModel,
	},
	returns: v.id("stages"),
	async handler(ctx, args) {
		throwIfNotLoggedIn(ctx);
		return await ctx.db.insert("stages", { ...args });
	},
});

export const updateStage = mutation({
	args: {
		id: v.id("stages"),
		...stageModel,
	},
	handler(ctx, args) {
		throwIfNotLoggedIn(ctx);
		const { id, ...data } = args;
		return ctx.db.replace(args.id, { ...data });
	},
});
