import { Static } from "elysia";
import { app } from "./server.js";
import { SportEnum, SportMap } from "./sport.js";
import {
	QueryFilter as TQueryFilter,
	LogicalFilters as TLogicalFilters,
	FieldFilter as TFieldFilter,
} from "./util/queryFilter.js";

export type App = typeof app;
export { SportEnum, SportMap };

export type QueryFilter = Static<typeof TQueryFilter>;
export type LogicalFilters = Static<typeof TLogicalFilters>;
export type FieldFilter = Static<typeof TFieldFilter>;

export {
	type UnionStage,
	type Stage,
	type AaipscStage,
	type IdpaStage,
	type IpscStage,
	type UspsaStage,
} from "./database/entities/stage.entity.js";

export {
	isIpscStage,
	isIdpaStage,
	isAaipscStage,
	isUspsaStage,
} from "./util/stageDistinct.js";

export { type Loaded } from "@mikro-orm/postgresql";

export { type PaginatedResult } from "./util/offsetBasedPagination.js";
