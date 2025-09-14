import { api } from "@/api";
import { authClient } from "@/auth/auth.client";
import { Sport } from "@ipsc_scoreboard/api";
import { createCollection } from "@tanstack/db";
import {
	QueryClient,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useConfirm } from "material-ui-confirm";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import z from "zod";
import { useLiveQuery } from "@tanstack/react-db";

export const constructShooterProfileQueryOption = (
	param: Parameters<(typeof api)["shooter-profile"]["get"]>[0]["query"],
) =>
	queryOptions({
		queryKey: ["shooterProfile", "list", param],
		queryFn: () =>
			api["shooter-profile"].get({
				query: param,
			}),
	});

export function useSelfShooterProfiles() {
	const session = authClient.useSession();

	return useQuery({
		queryKey: ["shooterProfile", "self"],
		queryFn: () =>
			api["shooter-profile"].get({
				query: {
					pagination: {
						first: 20,
					},
					filter: {
						operator: "and",
						value: [
							{
								field: "user",
								operator: "eq",
								value: session.data!.user.id,
							},
						],
					},
				},
			}),
	});
}

export function useMutateShooterProfile() {
	const confirm = useConfirm();

	return useMutation({
		mutationKey: ["editShooterProfile"],
		mutationFn: async (param: {
			id: number;
			sport: Sport;
			identifier: string;
		}) => {
			const res = await api["shooter-profile"]({ id: param.id }).put({
				sport: param.sport,
				identifier: param.identifier,
			});
			if (res.error) throw res.error;
			return res.data;
		},
		onError: (error) => {
			confirm({
				title: error.name,
				description: error.message,
				hideCancelButton: true,
			});
		},
		meta: {
			invalidateQueries: { queryKey: ["shooterProfile", "self"] },
		},
	});
}

export function useCreateShooterProfile() {
	const confirm = useConfirm();

	return useMutation({
		mutationKey: ["createShooterProfile"],
		mutationFn: async (param: { sport: Sport; identifier: string }) => {
			const res = await api["shooter-profile"].post({
				sport: param.sport,
				identifier: param.identifier,
			});
			if (res.error) throw res.error;
			return res.data;
		},
		onError: (error) => {
			confirm({
				title: error.name,
				description: error.message,
				hideCancelButton: true,
			});
		},
		meta: {
			invalidateQueries: { queryKey: ["shooterProfile", "self"] },
		},
	});
}

export function useDeleteShooterProfile() {
	const confirm = useConfirm();

	return useMutation({
		mutationKey: ["deleteShooterProfile"],
		mutationFn: async (id: number) => {
			const res = await api["shooter-profile"]({ id }).delete();
			if (res.error) throw res.error;
			return res.data;
		},
		onError: (error) => {
			confirm({
				title: error.name,
				description: error.message,
				hideCancelButton: true,
			});
		},
		meta: {
			invalidateQueries: { queryKey: ["shooterProfile", "self"] },
		},
	});
}

// const queryClient = new QueryClient();

// const shooterProfileSchema = z.object({
// 	id: z.number(),
// 	sport: z.nativeEnum(Sport),
// 	identifier: z.string(),
// });

// const shooterProfileCollection = createCollection(
// 	queryCollectionOptions({
// 		queryKey: ["shooterProfile"],
// 		queryClient,
// 		schema: shooterProfileSchema,
// 		queryFn: async () =>
// 			await api["shooter-profile"]
// 				.get({ query: { first: 20 } })
// 				.then((r) => r.data?.items || []),
// 		getKey: (item) => item.id,
// 		onInsert: async (item) => {
// 			for (const mutation of item.transaction.mutations) {
// 				api["shooter-profile"].post({
// 					identifier: mutation.modified.identifier,
// 					sport: mutation.modified.sport,
// 				});
// 			}
// 		},
// 		onUpdate: async (item) => {
// 			for (const mutation of item.transaction.mutations) {
// 				api["shooter-profile"]({ id: mutation.modified.id }).put({
// 					identifier: mutation.modified.identifier,
// 					sport: mutation.modified.sport,
// 				});
// 			}
// 		},
// 		onDelete: async (item) => {
// 			for (const mutation of item.transaction.mutations) {
// 				api["shooter-profile"]({ id: mutation.modified.id }).delete();
// 			}
// 		},
// 	}),
// );

// export const useShooterProfiles = () =>
// 	useLiveQuery((q) => q.from({ shooterProfiles: shooterProfileCollection }));

// export const useMutateShooterProfile = (
// 	shooterProfile: z.infer<typeof shooterProfileSchema>,
// ) =>
// 	shooterProfileCollection.update(shooterProfile.id, (d) => ({
// 		...d,
// 		...shooterProfile,
// 	}));

// export const useCreateShooterProfile = (
// 	shooterProfile: z.infer<typeof shooterProfileSchema>,
// ) => shooterProfileCollection.insert(shooterProfile);

// export const useDeleteShooterProfile = (id: number) =>
// 	shooterProfileCollection.delete(id);
