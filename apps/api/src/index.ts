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

import {
	ipscPaperTargetSchema,
	ipscSteelTargetSchema,
	uspsaPaperTargetSchema,
	uspsaSteelTargetSchema,
	aaipscPaperTargetSchema,
	aaipscSteelTargetSchema,
} from "./database/entities/stage.entity.js";

import {
	calculateMinimumRounds,
	calculateUniversalMinimumRounds,
} from "./util/stageUtils.js";

export type IpscPaperTarget = Static<typeof ipscPaperTargetSchema>;
export type IpscSteelTarget = Static<typeof ipscSteelTargetSchema>;
export type UspsaPaperTarget = Static<typeof uspsaPaperTargetSchema>;
export type UspsaSteelTarget = Static<typeof uspsaSteelTargetSchema>;
export type AaipscPaperTarget = Static<typeof aaipscPaperTargetSchema>;
export type AaipscSteelTarget = Static<typeof aaipscSteelTargetSchema>;

export { calculateMinimumRounds, calculateUniversalMinimumRounds };

export {
	isIpscStage,
	isIdpaStage,
	isAaipscStage,
	isUspsaStage,
} from "./util/stageDistinct.js";

export { type Loaded } from "@mikro-orm/postgresql";

export { type PaginatedResult } from "./util/offsetBasedPagination.js";
