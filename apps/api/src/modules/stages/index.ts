import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	Stage,
	StageImage,
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
	stagePopulateSchema,
} from "./stages.dto.js";
import { EntityDTO, Loaded, rel, wrap } from "@mikro-orm/core";
import { User } from "@/database/entities/user.entity.js";
import { Image } from "@/database/entities/image.entity.js";

type ElysiaTypeUnionStage = IpscStage | IdpaStage | AaipscStage | UspsaStage;

async function getStageById<T extends Stage = Stage>(
	id: number,
	populate: Static<typeof stagePopulateSchema> = [],
	sport?: SportEnum,
) {
	const stage = await orm.em.findOne(
		Stage,
		{
			id: id,
			...(sport && { type: sport }),
		},
		{
			populate,
		},
	);
	if (!stage) return status(404);
	return stage as unknown as T;
}

async function findStages<T extends Stage & object = ElysiaTypeUnionStage>(
	filter?: Static<typeof QueryFilter>,
	pagination?: Static<typeof OffsetBasedPaginationSchema>,
	populate: Static<typeof stagePopulateSchema> = [],
	sport?: SportEnum,
) {
	const [stages, totalCount] = await orm.em.findAndCount(
		Stage,
		{
			...convertQueryFilter<Stage>(filter),
			...(sport && { type: sport }),
		},
		{
			...parseOffsetBasedPaginationParams(pagination),
			populate,
		},
	);
	return serializeOffsetBasedPaginationResult(
		// @ts-ignore
		stages as EntityDTO<Loaded<T, "*">>[],
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
	// Repopulate images to get the latest images list
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
			return await findStages<ElysiaTypeUnionStage>(
				query.filter,
				query.pagination,
				query.populate,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params, query }) => {
			return await getStageById<ElysiaTypeUnionStage>(
				params.id,
				query.populate,
			);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
			query: t.Object({
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/ipsc",
		async ({ query }) => {
			return await findStages<IpscStage>(
				query.filter,
				query.pagination,
				query.populate,
				SportEnum.IPSC,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/ipsc/:id",
		async ({ params, query }) => {
			return await getStageById<IpscStage>(
				params.id,
				query.populate,
				SportEnum.IPSC,
			);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
			query: t.Object({
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/idpa",
		async ({ query }) => {
			return await findStages<IdpaStage>(
				query.filter,
				query.pagination,
				query.populate,
				SportEnum.IDPA,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/idpa/:id",
		async ({ params, query }) => {
			return await getStageById<IdpaStage>(
				params.id,
				query.populate,
				SportEnum.IDPA,
			);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
			query: t.Object({
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/aaipsc",
		async ({ query }) => {
			return await findStages<AaipscStage>(
				query.filter,
				query.pagination,
				query.populate,
				SportEnum.AAIPSC,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/aaipsc/:id",
		async ({ params, query }) => {
			return await getStageById<AaipscStage>(
				params.id,
				query.populate,
				SportEnum.AAIPSC,
			);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
			query: t.Object({
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/uspsa",
		async ({ query }) => {
			return await findStages<UspsaStage>(
				query.filter,
				query.pagination,
				query.populate,
				SportEnum.USPSA,
			);
		},
		{
			query: t.Object({
				pagination: t.Optional(OffsetBasedPaginationSchema),
				filter: t.Optional(QueryFilter),
				populate: t.Optional(stagePopulateSchema),
			}),
		},
	)
	.get(
		"/uspsa/:id",
		async ({ params, query }) => {
			return await getStageById<UspsaStage>(
				params.id,
				query.populate,
				SportEnum.USPSA,
			);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
			query: t.Object({
				populate: t.Optional(stagePopulateSchema),
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
	.delete(
		"/:id",
		async ({ params, user }) => {
			const stage = await orm.em.findOne(Stage, params.id);
			if (!stage) return status(404);
			if (stage.creator.id !== user.id) return status(401);
			await orm.em.removeAndFlush(stage);
			return status(204);
		},
		{
			isAuth: true,
			params: t.Object({ id: t.Integer() }),
		},
	);
