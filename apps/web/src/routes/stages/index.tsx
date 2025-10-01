import { StageCard } from "@/components/StageCard";
import Masonry from "@mui/lab/Masonry";
import { App, PaginatedResult, UnionStage } from "@ipsc_scoreboard/api";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import Button from "@mui/material/Button";
import { Link } from "@/components/MuiWrapper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { SportFilter } from "@/components/SportFilter";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const stageSearchSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(20).default(10),
	previousStages: z.optional(z.array(z.custom<UnionStage>())),
});

export const Route = createFileRoute("/stages/")({
	component: RouteComponent,
	validateSearch: zodValidator(stageSearchSchema),
	loaderDeps: ({ search: { limit, page, previousStages } }) => ({
		limit,
		page,
		previousStages,
	}),
	loader({ context, deps }) {
		return context.api.stage
			.get({
				query: {
					pagination: {
						limit: deps.limit,
						offset: (deps.page - 1) * deps.limit,
					},
					populate: ["creator.image"],
				} satisfies App["~Routes"]["api"]["stage"]["get"]["query"],
			})
			.then(async (res) => {
				if (res.status == 200) {
					if (deps.previousStages)
						// @ts-ignore
						res.data.items = [
							...deps.previousStages,
							...res.data!.items,
						];
					return res.data!;
				}
				throw res;
			});
	},
});

function FilterBar() {
	const theme = useTheme();
	const smallVariant = useMediaQuery(theme.breakpoints.down("xs"));

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={1}>
				<TextField
					size={smallVariant ? "small" : "medium"}
					label="Search Stages"
					variant="outlined"
					fullWidth
				/>
				<SportFilter filters={[]} setFilters={() => {}} />
			</Stack>
		</Paper>
	);
}

function RouteComponent() {
	const stages =
		Route.useLoaderData() as unknown as PaginatedResult<UnionStage>;
	const search = Route.useSearch();

	return (
		<>
			<Stack spacing={1}>
				<FilterBar />
				<Masonry
					columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
					spacing={0.5}
					sequential
				>
					{stages.items.map((stage) => {
						return (
							<StageCard
								onClick={() => {}}
								key={stage.id}
								creator={{
									name: stage.creator.name,
									image: stage.creator.image,
								}}
								stage={stage}
							/>
						);
					})}
				</Masonry>
				{stages.hasNextPage ? (
					<Link
						to="."
						search={{
							page: search.page + 1,
							limit: search.limit,
							previousStages: stages.items,
						}}
						mask={{
							to: ".",
							search: {
								page: search.page + 1,
								limit: search.limit,
							},
						}}
						viewTransition
					>
						<Button size="large" fullWidth variant="outlined">
							Load More Stages
						</Button>
					</Link>
				) : (
					<Typography variant="h5" textAlign="center">
						No more stages. <br />
						<Link to=".">Back to first page</Link>
					</Typography>
				)}
			</Stack>
		</>
	);
}
