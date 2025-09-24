import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	isAaipscStage,
	isIdpaStage,
	isIpscStage,
	isUspsaStage,
	Stage,
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
import { Elysia, status, t } from "elysia";

export const stagesRoute = new Elysia({
	prefix: "stage",
})
	.use(authPlugin)
	.get(
		"/",
		async ({ query }) => {
			const [stages, totalCount] = await orm.em.findAndCount(
				Stage,
				convertQueryFilter<Stage>(query.filter),
				parseOffsetBasedPaginationParams(query.pagination),
			);
			return serializeOffsetBasedPaginationResult(
				stages,
				totalCount,
				query.pagination,
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
		"/:id",
		async ({ params }) => {
			const stage = await orm.em.findOne(Stage, params.id);
			if (!stage) return status(404);
			if (isIpscStage(stage)) return stage;
			if (isAaipscStage(stage)) return stage;
			if (isIdpaStage(stage)) return stage;
			if (isUspsaStage(stage)) return stage;
			return status(410);
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
			const [stages, totalCount] = await orm.em.findAndCount(
				Stage,
				{
					...convertQueryFilter<Stage>(query.filter),
					type: SportEnum.IPSC,
				},
				parseOffsetBasedPaginationParams(query.pagination),
			);
			return serializeOffsetBasedPaginationResult(
				stages as IpscStage[],
				totalCount,
				query.pagination,
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
			const stage = await orm.em.findOne(Stage, {
				id: params.id,
				type: SportEnum.IPSC,
			});
			if (isIpscStage(stage)) return stage;
			return status(404);
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
			const [stages, totalCount] = await orm.em.findAndCount(
				Stage,
				{
					...convertQueryFilter<Stage>(query.filter),
					type: SportEnum.IDPA,
				},
				parseOffsetBasedPaginationParams(query.pagination),
			);
			return serializeOffsetBasedPaginationResult(
				stages as IdpaStage[],
				totalCount,
				query.pagination,
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
			const stage = await orm.em.findOne(Stage, {
				id: params.id,
				type: SportEnum.IDPA,
			});
			if (isIdpaStage(stage)) return stage;
			return status(404);
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
			const [stages, totalCount] = await orm.em.findAndCount(
				Stage,
				{
					...convertQueryFilter<Stage>(query.filter),
					type: SportEnum.AAIPSC,
				},
				parseOffsetBasedPaginationParams(query.pagination),
			);
			return serializeOffsetBasedPaginationResult(
				stages as AaipscStage[],
				totalCount,
				query.pagination,
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
			const stage = await orm.em.findOne(Stage, {
				id: params.id,
				type: SportEnum.AAIPSC,
			});
			if (isAaipscStage(stage)) return stage;
			return status(404);
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
			const [stages, totalCount] = await orm.em.findAndCount(
				Stage,
				{
					...convertQueryFilter<Stage>(query.filter),
					type: SportEnum.USPSA,
				},
				parseOffsetBasedPaginationParams(query.pagination),
			);
			return serializeOffsetBasedPaginationResult(
				stages as UspsaStage[],
				totalCount,
				query.pagination,
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
			const stage = await orm.em.findOne(Stage, {
				id: params.id,
				type: SportEnum.USPSA,
			});
			if (isUspsaStage(stage)) return stage;
			return status(404);
		},
		{
			params: t.Object({
				id: t.Integer(),
			}),
		},
	)
	.post("/", () => {}, {
		isAuth: true,
	})
	.patch("/:id", () => {}, {
		isAuth: true,
	})
	.delete("/:id", () => {}, {
		isAuth: true,
	});
