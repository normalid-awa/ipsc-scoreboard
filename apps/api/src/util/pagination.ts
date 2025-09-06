import { Cursor } from "@mikro-orm/core";
import { t } from "elysia";

export function paginationDto(sortableFields: readonly string[]) {
	return {
		first: t.Numeric({ minimum: 1, default: 20 }),
		after: t.Optional(t.String()),
		sortField: t.UnionEnum(["id", ...sortableFields], { default: "id" }),
		sortDirection: t.UnionEnum(["ASC", "DESC"], { default: "ASC" }),
	};
}

export function parsePaginationParams(param: {
	first: number;
	after?: string | null | undefined;
	sortField: string;
	sortDirection: "ASC" | "DESC";
}) {
	return {
		first: param.first,
		after: { endCursor: param.after || null },
		orderBy: {
			[param.sortField as unknown as string]: param.sortDirection,
		},
	};
}

export function serializePaginationResult<T extends object>(result: Cursor<T>) {
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
