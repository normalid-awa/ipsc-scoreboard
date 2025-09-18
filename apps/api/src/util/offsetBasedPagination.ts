import { FindOptions, OrderDefinition } from "@mikro-orm/core";
import { Static, t } from "elysia";

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

const offsetBasedPaginationSchema = t.Object({
	limit: t.Optional(t.Number({ minimum: 1, default: DEFAULT_LIMIT })),
	offset: t.Optional(t.Number({ minimum: 0, default: DEFAULT_OFFSET })),
	sortField: t.Optional(t.String({ default: "id" })),
	sortDirection: t.Optional(
		t.UnionEnum(["ASC", "DESC"], { default: "DESC" }),
	),
});

export function offsetBasedPaginationDto() {
	return offsetBasedPaginationSchema;
}

/**
 *  Used for findAndCount
 * */
export function parseOffsetBasedPaginationParams<Entity>(
	param: Static<typeof offsetBasedPaginationSchema>,
): FindOptions<Entity> {
	return {
		limit: param.limit || DEFAULT_LIMIT,
		offset: param.offset || DEFAULT_OFFSET,
		orderBy: {
			[param.sortField || "id"]: param.sortDirection || "DESC",
		} as OrderDefinition<Entity>,
	};
}

/**
 * Used for parse the result of findAndCount
 */
export function serializeOffsetBasedPaginationResult<Entity>(
	results: Entity[],
	totalCount: number,
	paginationParams: Static<typeof offsetBasedPaginationSchema>,
) {
	const limit = paginationParams.limit || DEFAULT_LIMIT;
	const offset = paginationParams.offset || DEFAULT_OFFSET;
	const hasNextPage = totalCount > limit + offset;
	const hasPrevPage = offset > 0;
	const currentPage = Math.floor(offset / limit) + 1;
	const totalPages = Math.ceil(totalCount / limit);

	return {
		items: results,
		length: totalCount,
		hasNextPage,
		hasPrevPage,
		currentPage,
		totalPages,
		limit,
		offset,
	};
}
