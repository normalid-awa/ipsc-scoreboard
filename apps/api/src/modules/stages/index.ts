import { Image } from "@/database/entities/image.entity.js";
import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	Stage,
	StageImage,
	UnionStage,
	UspsaStage,
} from "@/database/entities/stage.entity.js";
import { User } from "@/database/entities/user.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { SportEnum } from "@/sport.js";
import {
	OffsetBasedPaginationSchema,
	parseOffsetBasedPaginationParams,
	serializeOffsetBasedPaginationResult,
} from "@/util/offsetBasedPagination.js";
import { convertQueryFilter, QueryFilter } from "@/util/queryFilter.js";
import { rel } from "@mikro-orm/core";
import { Elysia, Static, status, t } from "elysia";

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

export const stagesRoute = new Elysia({
	prefix: "stage",
})
	.use(authPlugin)
	// #region Read
	.group("", (app) =>
		app
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
					return await getStageById<IpscStage>(
						params.id,
						SportEnum.IPSC,
					);
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
					return await getStageById<IdpaStage>(
						params.id,
						SportEnum.IDPA,
					);
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
					return await getStageById<AaipscStage>(
						params.id,
						SportEnum.AAIPSC,
					);
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
					return await getStageById<UspsaStage>(
						params.id,
						SportEnum.USPSA,
					);
				},
				{
					params: t.Object({
						id: t.Integer(),
					}),
				},
			),
	)
	// #endregion
	.post(
		"/",
		async () => {
			const stage = new IpscStage();
			stage.creator = rel(User, "34fb9fd4-8267-4a0d-826e-57e2e3db5e4b");
			stage.title = "123";
			stage.ipscPaperTargets = [
				{
					targetId: 1,
					hasNoShoot: false,
					isNoPenaltyMiss: false,
					requiredHits: 2,
				},
				{
					targetId: 2,
					hasNoShoot: true,
					isNoPenaltyMiss: false,
					requiredHits: 2,
				},
				{
					targetId: 3,
					hasNoShoot: false,
					isNoPenaltyMiss: false,
					requiredHits: 2,
				},
			];
			stage.ipscSteelTargets = [
				{
					targetId: 1,
					isNoShoot: false,
				},
				{
					targetId: 2,
					isNoShoot: true,
				},
			];
			stage.walkthroughTime = 200;

			const images = [
				new StageImage(
					stage,
					rel(Image, "3ebcdea7-6cca-4451-b929-af6133a9f6e3"),
					0,
				),
				new StageImage(
					stage,
					rel(Image, "45bd1dcb-251f-4eb4-8e1b-9f90a7bd6745"),
					1,
				),
			];

			orm.em.persist(images);
			orm.em.persist(stage);
			await orm.em.flush();

			console.log(stage);
			console.log(await orm.em.findOne(Stage, stage.id));
		},
		{
			isAuth: true,
		},
	)
	.patch("/:id", () => {}, {
		isAuth: true,
	})
	.delete("/:id", () => {}, {
		isAuth: true,
	});
