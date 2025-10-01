import { api } from "@/api";
import { App } from "@ipsc_scoreboard/api";
import { queryOptions } from "@tanstack/react-query";

export const stagesQueryOption = (
	param: App["~Routes"]["api"]["stage"]["get"]["query"],
) =>
	queryOptions({
		queryKey: ["stage", "list", param],
		queryFn: () =>
			api["stage"].get({
				query: param,
			}),
	});
