import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	Stage,
	StageImage,
	UnionStage,
	UspsaStage,
} from "@/database/entities/stage.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { SportEnum } from "@/sport.js";
import {
	OffsetBasedPaginationSchema,
	parseOffsetBasedPaginationParams,
	serializeOffsetBasedPaginationResult,
} from "@/util/offsetBasedPagination.js";
import { convertQueryFilter, QueryFilter } from "@/util/queryFilter.js";
import { Elysia, Static, status, t } from "elysia";
import {
	createAaipscStageSchema,
	createIdpaStageSchema,
	createIpscStageSchema,
	createStageSchema,
	createUspsaStageSchema,
} from "./stages.dto.js";
import { rel, wrap } from "@mikro-orm/core";
import { User } from "@/database/entities/user.entity.js";
import { Image } from "@/database/entities/image.entity.js";

async function getStageById<T extends Stage = Stage>(
	id: number,
	sport?: SportEnum,
) {
	const stage = await orm.em.findOne(Stage, {
		id: id,
		...(sport && { type: sport }),
	});
	if (!stage) return status(404);
	return stage as unknown as T;
}

async function findStages<T extends Stage = Stage>(
	filter?: Static<typeof QueryFilter>,
	pagination?: Static<typeof OffsetBasedPaginationSchema>,
	sport?: SportEnum,
) {
	const [stages, totalCount] = await orm.em.findAndCount(
		Stage,
		{
			...convertQueryFilter<Stage>(filter),
			...(sport && { type: sport }),
		},
		parseOffsetBasedPaginationParams(pagination),
	);
	return serializeOffsetBasedPaginationResult(
		stages as unknown as T[],
		totalCount,
		pagination,
	);
}

/**
 *
 * @param entity
 * @param params
 * @param userId
 * @returns return a tuple of entities which should be persist to db.
 */
async function initStage<T extends Stage>(
	entity: T,
	params: Static<typeof createStageSchema>,
	userId: string,
): Promise<[T, ...StageImage[]]> {
	entity.title = params.title;
	entity.description = params.description;
	entity.walkthroughTime = params.walkthroughTime;
	let images: StageImage[] = [];
	if (params.images && Array.isArray(params.images))
		images = await Promise.all(
			params.images.map(async (imageFile, k) => {
				const image = new Image();
				await image.upload(imageFile, rel(User, userId));
				orm.em.persist(image);
				return new StageImage(entity, image, k);
			}),
		);
	entity.creator = rel(User, userId);
	return [entity, ...(images || [])];
}

async function patchStage<
	T extends Stage,
	P extends Partial<Static<typeof createStageSchema>>,
>(id: number, params: P, userId: string, sport: SportEnum) {
	const stage = (await orm.em.findOne(
		Stage,
		{ id, type: sport },
		{ populate: ["images:ref"] },
	)) as T;
	if (!stage) return status(404);
	if (stage.creator.id !== userId) return status(401);
	const { images, ...rest } = params;
	if (typeof images !== "undefined") {
		stage.images.removeAll();
		if (images !== null && Array.isArray(images)) {
			await Promise.all(
				images.map(async (imageFile, k) => {
					const image = new Image();
					await image.upload(imageFile, rel(User, userId));
					orm.em.persist(image);
					const newStageImage = new StageImage(stage, image, k);
					orm.em.persist(newStageImage);
					return newStageImage;
				}),
			);
		}
	}
	// @ts-ignore
	wrap(stage).assign(rest);
	await orm.em.flush();
	await stage.images.init({
		refresh: true,
	});
	return stage;
}

export const stagesRoute = new Elysia({
	prefix: "stage",
})
	.use(authPlugin)
	// #region Read
	.get(
		"/",
		async ({ query }) => {
			return await findStages(query.filter, query.pagination);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params }) => {
			return await getStageById<UnionStage>(params.id);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
		},
	)
	.get(
		"/ipsc",
		async ({ query }) => {
			return await findStages<IpscStage>(
				query.filter,
				query.pagination,
				SportEnum.IPSC,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
			}),
		},
	)
	.get(
		"/ipsc/:id",
		async ({ params }) => {
			return await getStageById<IpscStage>(params.id, SportEnum.IPSC);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
		},
	)
	.get(
		"/idpa",
		async ({ query }) => {
			return await findStages<IdpaStage>(
				query.filter,
				query.pagination,
				SportEnum.IDPA,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
			}),
		},
	)
	.get(
		"/idpa/:id",
		async ({ params }) => {
			return await getStageById<IdpaStage>(params.id, SportEnum.IDPA);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
		},
	)
	.get(
		"/aaipsc",
		async ({ query }) => {
			return await findStages<AaipscStage>(
				query.filter,
				query.pagination,
				SportEnum.AAIPSC,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
			}),
		},
	)
	.get(
		"/aaipsc/:id",
		async ({ params }) => {
			return await getStageById<AaipscStage>(params.id, SportEnum.AAIPSC);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
		},
	)
	.get(
		"/uspsa",
		async ({ query }) => {
			return await findStages<UspsaStage>(
				query.filter,
				query.pagination,
				SportEnum.USPSA,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
			}),
		},
	)
	.get(
		"/uspsa/:id",
		async ({ params }) => {
			return await getStageById<UspsaStage>(params.id, SportEnum.USPSA);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
		},
	)
	// #endregion
	// #region Create
	.post(
		"/ipsc",
		async ({ body, user }) => {
			let [stage, ...images] = await initStage(
				new IpscStage(),
				body,
				user.id,
			);
			stage.ipscPaperTargets = body.ipscPaperTargets;
			stage.ipscSteelTargets = body.ipscSteelTargets;
			orm.em.persist([stage, ...images]);
			await orm.em.flush();
			await stage.images.init();
			return stage;
		},
		{
			isAuth: true,
			body: createIpscStageSchema,
		},
	)
	.post(
		"/idpa",
		async ({ body, user }) => {
			let [stage, ...images] = await initStage(
				new IdpaStage(),
				body,
				user.id,
			);
			stage.idpaPaperTargets = body.idpaPaperTargets;
			stage.idpaSteelTargets = body.idpaSteelTargets;
			await orm.em.persist([stage, ...images]).flush();
			await stage.images.init();
			return stage;
		},
		{
			isAuth: true,
			body: createIdpaStageSchema,
		},
	)
	.post(
		"/aaipsc",
		async ({ body, user }) => {
			let [stage, ...images] = await initStage(
				new AaipscStage(),
				body,
				user.id,
			);
			stage.aaipscPaperTargets = body.aaipscPaperTargets;
			stage.aaipscSteelTargets = body.aaipscSteelTargets;
			await orm.em.persist([stage, ...images]).flush();
			await stage.images.init();
			return stage;
		},
		{
			isAuth: true,
			body: createAaipscStageSchema,
		},
	)
	.post(
		"/uspsa",
		async ({ body, user }) => {
			let [stage, ...images] = await initStage(
				new UspsaStage(),
				body,
				user.id,
			);
			stage.uspsaPaperTargets = body.uspsaPaperTargets;
			stage.uspsaSteelTargets = body.uspsaSteelTargets;
			stage.uspsaScoringMethod = body.uspsaScoringMethod;
			await orm.em.persist([stage, ...images]).flush();
			await stage.images.init();
			return stage;
		},
		{
			isAuth: true,
			body: createUspsaStageSchema,
		},
	)
	// #endregion
	// #region Update
	.patch(
		"/ipsc/:id",
		async ({ params, body, user }) => {
			return await patchStage<
				IpscStage,
				Partial<Static<typeof createIpscStageSchema>>
			>(params.id, body, user.id, SportEnum.IPSC);
		},
		{
			isAuth: true,
			params: t.Object({ id: t.Integer() }),
			body: t.Partial(createIpscStageSchema),
		},
	)
	.patch(
		"/idpa/:id",
		async ({ params, body, user }) => {
			return await patchStage<
				IdpaStage,
				Partial<Static<typeof createIdpaStageSchema>>
			>(params.id, body, user.id, SportEnum.IDPA);
		},
		{
			isAuth: true,
			params: t.Object({ id: t.Integer() }),
			body: t.Partial(createIdpaStageSchema),
		},
	)
	.patch(
		"/aaipsc/:id",
		async ({ params, body, user }) => {
			return await patchStage<
				AaipscStage,
				Partial<Static<typeof createAaipscStageSchema>>
			>(params.id, body, user.id, SportEnum.AAIPSC);
		},
		{
			isAuth: true,
			params: t.Object({ id: t.Integer() }),
			body: t.Partial(createAaipscStageSchema),
		},
	)
	.patch(
		"/uspsa/:id",
		async ({ params, body, user }) => {
			return await patchStage<
				UspsaStage,
				Partial<Static<typeof createUspsaStageSchema>>
			>(params.id, body, user.id, SportEnum.USPSA);
		},
		{
			isAuth: true,
			params: t.Object({ id: t.Integer() }),
			body: t.Partial(createUspsaStageSchema),
		},
	)
	// #endregion
	.delete("/:id", () => {}, {
		isAuth: true,
	});
