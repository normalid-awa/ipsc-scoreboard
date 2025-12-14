export function wrapArray<B extends boolean, V>(cond: B, ret: V): [V] | [] {
	return cond ? [ret] : [];
}
