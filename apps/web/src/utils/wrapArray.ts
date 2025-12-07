export function wrapArray<V>(cond: boolean, ret: V): [V] | [] {
	return cond ? [ret] : [];
}
