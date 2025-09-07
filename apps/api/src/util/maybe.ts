export function normalizeOptionalQueryCondition<T>(
	maybe: T | undefined | null,
): NonNullable<T> {
	if (maybe) return maybe;
	if (maybe === undefined) return undefined!;
	return null!;
}
