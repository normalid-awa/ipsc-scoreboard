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
	operator: LogicalOperators,
	value: t.Array(
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
});

export const QueryFilter = LogicalFilters;
export type QueryFilter = Static<typeof QueryFilter>;

// Operator mapping to Mikro-ORM operator
export function convertFilter<Entity>(
	filter: Static<typeof QueryFilter> | Static<typeof FieldFilter>,
): FilterQuery<Entity> {
	if (!filter || Object.keys(filter).length === 0) return {};
	if ("field" in filter) {
		// Handle FieldFilter types
		const { field, operator, value } = filter;

		switch (operator) {
			case "eq":
				//@ts-ignore
				return { [field]: value };
			case "ne":
				//@ts-ignore
				return { [field]: { $ne: value } };
			case "gt":
				//@ts-ignore
				return { [field]: { $gt: value } };
			case "gte":
				//@ts-ignore
				return { [field]: { $gte: value } };
			case "lt":
				//@ts-ignore
				return { [field]: { $lt: value } };
			case "lte":
				//@ts-ignore
				return { [field]: { $lte: value } };
			case "in":
				//@ts-ignore
				return { [field]: { $in: value } };
			case "nin":
				//@ts-ignore
				return { [field]: { $nin: value } };
			case "like":
				//@ts-ignore
				return { [field]: { $like: value } };
			case "re":
				//@ts-ignore
				return { [field]: { $re: value } };
			default:
				throw new Error(`Unsupported operator: ${operator}`);
		}
	} else {
		// Handle LogicalFilters
		const { operator, value } = filter;
		const conditions = value.map((v) =>
			convertFilter(v as Static<typeof QueryFilter>),
		);

		switch (operator) {
			case "and":
				//@ts-ignore
				return { $and: conditions };
			case "or":
				//@ts-ignore
				return { $or: conditions };
			case "not":
				//@ts-ignore
				return { $not: conditions[0] }; // MikroORM's $not expects a single condition
			default:
				throw new Error(`Unsupported logical operator: ${operator}`);
		}
	}
}
