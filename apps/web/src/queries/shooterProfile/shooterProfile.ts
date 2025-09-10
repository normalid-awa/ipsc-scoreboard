import { api } from "@/api";
import { authClient } from "@/auth/auth.client";
import { Sport } from "@ipsc_scoreboard/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useConfirm } from "material-ui-confirm";

const shooterProfileQueryKey = ["shooterProfile"];

export function useShooterProfiles() {
	const session = authClient.useSession();

	return useQuery({
		queryKey: shooterProfileQueryKey,
		queryFn: () =>
			api["shooter-profile"].get({
				query: {
					first: 20,
					user: session.data!.user.id,
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
			invalidateQueries: { queryKey: shooterProfileQueryKey },
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
			invalidateQueries: { queryKey: shooterProfileQueryKey },
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
			invalidateQueries: { queryKey: shooterProfileQueryKey },
		},
	});
}
