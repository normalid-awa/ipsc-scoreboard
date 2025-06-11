import {
	defineTable,
	paginationOptsValidator,
	PaginationResult,
} from "convex/server";
import { mutation, query, QueryCtx } from "./_generated/server";
import { throwIfNotLoggedIn } from "./utils/auth";
import { ConvexError, Infer, v } from "convex/values";
import { AppError, AppErrorCode } from "./utils/errorType";

const stageModel = v.object({
	title: v.string(),
	description: v.string(),
	briefing: v.string(),
	designer: v.id("users"),
	images: v.array(v.id("_storage")),
	papers: v.number(),
	noShoots: v.number(),
	poppers: v.number(),
	walkthroughTime: v.number(), // in minutes
});

const stageDto = v.object({
	...stageModel.fields,
	imagesUrl: v.array(v.string()),
});

export const stageTables = {
	stages: defineTable(stageModel),
};

async function toStageDto(
	stage: Infer<typeof stageModel>,
	ctx: QueryCtx,
): Promise<Infer<typeof stageDto>> {
	const result: Infer<typeof stageDto> = { ...stage } as unknown as Infer<
		typeof stageDto
	>;
	result.imagesUrl = await Promise.all(
		stage.images.map(async (imageId) => {
			return (await ctx.storage.getUrl(imageId)) ?? "";
		}),
	);
	return result;
}

export const getStage = query({
	args: {
		id: v.id("stages"),
	},
	async handler(ctx, args) {
		const stage = await ctx.db.get(args.id);
		if (!stage) {
			throw new ConvexError({
				code: AppErrorCode.NotFound,
				message: "Stage not found",
			} satisfies AppError);
		}
		return await toStageDto(stage, ctx);
	},
});

export const getStages = query({
	args: {
		paginationOpts: paginationOptsValidator,
	},
	async handler(ctx, args) {
		const data = await ctx.db.query("stages").paginate(args.paginationOpts);
		const result: PaginationResult<Infer<typeof stageDto>> = {
			...data,
			page: [],
		};
		for (const stage in data.page) {
			result.page[stage] = await toStageDto(data.page[stage], ctx);
		}
		return result;
	},
});

export const createStage = mutation({
	args: {
		...stageModel.fields,
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
		...stageModel.fields,
	},
	handler(ctx, args) {
		throwIfNotLoggedIn(ctx);
		const { id, ...data } = args;
		return ctx.db.replace(args.id, { ...data });
	},
});
