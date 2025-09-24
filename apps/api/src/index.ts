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
