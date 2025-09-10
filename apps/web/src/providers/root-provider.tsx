import {
	InvalidateQueryFilters,
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

import "@tanstack/react-query";

declare module "@tanstack/react-query" {
	interface Register {
		queryMeta: {};
		mutationMeta: {
			invalidateQueries?: InvalidateQueryFilters;
		};
	}
}

export function getContext() {
	const queryClient = new QueryClient({
		mutationCache: new MutationCache({
			onSuccess(_data, _variables, _context, mutation) {
				if (mutation.meta?.invalidateQueries) {
					queryClient.invalidateQueries(
						mutation.meta.invalidateQueries,
					);
				}
			},
		}),
	});
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
