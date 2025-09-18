import { Cursor } from "@mikro-orm/core";
import { Static, t } from "elysia";

const cursorBasedPaginationSchema = t.Object({
	first: t.Numeric({ minimum: 1, default: 20 }),
	after: t.Optional(t.String()),
	before: t.Optional(t.String()),
	sortField: t.Optional(t.String({ default: "id" })),
	sortDirection: t.Optional(
		t.UnionEnum(["ASC", "DESC"], { default: "DESC" }),
	),
});

export function cursorBasedPaginationDto() {
	return cursorBasedPaginationSchema;
}

export function parseCursorBasedPaginationParams(
	param: Static<typeof cursorBasedPaginationSchema>,
) {
	return {
		first: param.first,
		after: { endCursor: param.after || null },
		before: { startCursor: param.before || null },
		orderBy: {
			[(param.sortField as unknown as string) || "id"]:
				param.sortDirection || "DESC",
		},
	};
}

export function serializeCursorBasedPaginationResult<T extends object>(
	result: Cursor<T>,
) {
	return {
		items: result.items,
		endCursor: result.endCursor,
		startCursor: result.startCursor,
		totalCount: result.totalCount,
		hasNextPage: result.hasNextPage,
		hasPrevPage: result.hasPrevPage,
		length: result.length,
	};
}
