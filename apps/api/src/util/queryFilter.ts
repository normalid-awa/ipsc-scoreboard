import { FilterQuery } from "@mikro-orm/core";
import { Static, t } from "elysia";

const SingleNumericValueFilterOperators = t.Union([
	t.Literal("eq"),
	t.Literal("ne"),
	t.Literal("gt"),
	t.Literal("gte"),
	t.Literal("lt"),
	t.Literal("lte"),
]);
export const SingleNumericValueFieldFilter = t.Object({
	field: t.String(),
	operator: SingleNumericValueFilterOperators,
	value: t.Number(),
});

const MultiNumericValueFilterOperators = t.Union([
	t.Literal("in"),
	t.Literal("nin"),
]);
export const MultiNumericValueFieldFilter = t.Object({
	field: t.String(),
	operator: MultiNumericValueFilterOperators,
	value: t.Array(t.Number()),
});

const SingleStringValueFilterOperators = t.Union([
	t.Literal("eq"),
	t.Literal("ne"),
	t.Literal("like"),
	t.Literal("re"),
]);
export const SingleStringValueFieldFilter = t.Object({
	field: t.String(),
	operator: SingleStringValueFilterOperators,
	value: t.String(),
});

const MultiStringValueFilterOperators = t.Union([
	t.Literal("in"),
	t.Literal("nin"),
]);
export const MultiStringValueFieldFilter = t.Object({
	field: t.String(),
	operator: MultiStringValueFilterOperators,
	value: t.Array(t.String()),
});

const BooleanValueFilterOperators = t.Union([t.Literal("eq"), t.Literal("ne")]);
export const BooleanValueFieldFilter = t.Object({
	field: t.String(),
	operator: BooleanValueFilterOperators,
	value: t.BooleanString(),
});

export const FieldFilter = t.Union([
	SingleNumericValueFieldFilter,
	MultiNumericValueFieldFilter,
	SingleStringValueFieldFilter,
	MultiStringValueFieldFilter,
	BooleanValueFieldFilter,
]);

const LogicalOperators = t.Union([
	t.Literal("and"),
	t.Literal("or"),
	t.Literal("not"),
]);

// export const LogicalFilters = t.Recursive((self) =>
// 	t.Object({
// 		operator: LogicalOperators,
// 		value: t.Array(t.Union([FieldFilter, self])),
// 	}),
// );

// Due to a bug of tsc, recusive type can't be compiled correctly.
// Hence manually define the type of LogicalFilters. (3 layer is enough for now)
export const LogicalFilters = t.Object({
	operator: t.Optional(LogicalOperators),
	value: t.Optional(
		t.Array(
			t.Union([
				FieldFilter,
				t.Object({
					operator: LogicalOperators,
					value: t.Array(
						t.Union([
							FieldFilter,
							t.Object({
								operator: LogicalOperators,
								value: t.Array(t.Union([FieldFilter])),
							}),
						]),
					),
				}),
			]),
		),
	),
});

export const QueryFilter = LogicalFilters;
export type QueryFilter = Static<typeof QueryFilter>;

function processFieldFilter(filter: Static<typeof FieldFilter>): any {
	const operatorMap = {
		eq: "$eq",
		ne: "$ne",
		gt: "$gt",
		gte: "$gte",
		lt: "$lt",
		lte: "$lte",
		in: "$in",
		nin: "$nin",
		like: "$like",
		re: "$re",
	};

	const operator = operatorMap[filter.operator];
	let value = filter.value;

	// Handle boolean string conversion
	if (filter.operator === "eq" || filter.operator === "ne") {
		if (value === "true") value = true;
		if (value === "false") value = false;
	}

	// Handle regex conversion
	if (filter.operator === "re") {
		value = new RegExp(value as string) as unknown as string;
	}

	// Split nested field paths
	const parts = filter.field.split(".");
	const condition = { [operator]: value };

	// Build nested condition object
	return parts.reduceRight((acc: any, part: string, index: number) => {
		return index === parts.length - 1
			? { [part]: condition }
			: { [part]: acc };
	}, {});
}

export function convertQueryFilter<T>(filter?: QueryFilter): FilterQuery<T> {
	if (!filter || Object.keys(filter).length === 0) return {};
	if (filter.operator === "and" || filter.operator === "or") {
		return {
			[filter.operator === "and" ? "$and" : "$or"]:
				//@ts-ignore
				filter.value.map(convertQueryFilter),
		} as FilterQuery<T>;
	}

	if (filter.operator === "not") {
		return {
			// @ts-ignore
			$not: filter.value.map(convertQueryFilter),
		} as FilterQuery<T>;
	}

	// @ts-ignore
	return processFieldFilter(filter);
}
