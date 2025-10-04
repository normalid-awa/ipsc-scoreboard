import { StageCard } from "@/components/StageCard";
import Masonry from "@mui/lab/Masonry";
import {
	App,
	FieldFilter,
	LogicalFilters,
	PaginatedResult,
	SportEnum,
	UnionStage,
} from "@ipsc_scoreboard/api";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import Button from "@mui/material/Button";
import { Link } from "@/components/MuiWrapper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { SportFilter } from "@/components/SportFilter";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { wrapArray } from "@/utils/wrapArray";
import { debounce } from "@mui/material/utils";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useScrollTarget } from "@/components/layout/LayoutViewScrollTargetProvider";
import { ClientOnly } from "@tanstack/react-router";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";

const stageSearchSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(20).default(10),
	previousStages: z.optional(z.array(z.custom<UnionStage>())),
	sportFilter: z.optional(z.array(z.nativeEnum(SportEnum)).default([])),
	searchPhrase: z.optional(z.string().max(100)).catch(undefined),
});

export const Route = createFileRoute("/stages/")({
	component: RouteComponent,
	validateSearch: zodValidator(stageSearchSchema),
	loaderDeps: ({
		search: { limit, page, previousStages, sportFilter, searchPhrase },
	}) => ({
		limit,
		page,
		previousStages,
		sportFilter,
		searchPhrase,
	}),
	loader({ context, deps }) {
		return context.api.stage
			.get({
				query: {
					pagination: {
						limit: deps.limit,
						offset: (deps.page - 1) * deps.limit,
					},
					filter: {
						operator: "and",
						value: [
							...wrapArray((deps.sportFilter || []).length > 0, {
								field: "type",
								operator: "in",
								value: deps.sportFilter!,
							} satisfies FieldFilter),
							...wrapArray(!!deps.searchPhrase, {
								operator: "or",
								value: [
									{
										field: "title",
										operator: "like",
										value: `%${deps.searchPhrase}%`,
									},
									{
										field: "description",
										operator: "like",
										value: `%${deps.searchPhrase}%`,
									},
								],
							} satisfies LogicalFilters),
						],
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
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const debouncedSearch = debounce(
		(searchPhrase: string) =>
			navigate({
				to: ".",
				search: ({ previousStages, ...old }) => ({
					...old,
					searchPhrase,
				}),
				mask: {
					search: (old) => ({
						page: old.page,
						limit: old.limit,
						searchPhrase,
					}),
				},
			}),
		500,
	);

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={1}>
				<TextField
					size={smallVariant ? "small" : "medium"}
					label="Search Stages"
					variant="outlined"
					fullWidth
					name="search"
					type="search"
					onChange={(e) => {
						debouncedSearch(e.target.value);
					}}
				/>
				<SportFilter
					filters={search.sportFilter || []}
					setFilters={(filters) => {
						navigate({
							to: ".",
							search: ({ previousStages, ...old }) => ({
								...old,
								page: 1,
								sportFilter: filters,
							}),
							mask: {
								search: (old) => ({
									page: 1,
									limit: old.limit,
									searchPhrase: old.searchPhrase,
								}),
							},
						});
					}}
				/>
			</Stack>
		</Paper>
	);
}

function ScrollTop() {
	const scrollTarget = useScrollTarget();
	const showScrollToTopButton = useScrollTrigger({
		target: scrollTarget,
		disableHysteresis: true,
		threshold: 100,
	});

	return (
		<Zoom in={showScrollToTopButton} unmountOnExit>
			<Fab
				sx={{
					position: "absolute",
					bottom: (t) => t.spacing(3),
					right: (t) => t.spacing(3),
				}}
				aria-label="Scroll back to top"
				color="primary"
				size="medium"
				onClick={() => {
					scrollTarget?.scrollTo({ top: 0, behavior: "smooth" });
				}}
			>
				<VerticalAlignTopIcon />
			</Fab>
		</Zoom>
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
					defaultHeight={450}
					defaultColumns={4}
					defaultSpacing={1}
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
				<Box>
					{stages.hasNextPage ? (
						<Link
							to="."
							search={(old) => ({
								...old,
								page: search.page + 1,
								limit: search.limit,
								previousStages: stages.items,
							})}
							mask={{
								to: ".",
								search: {
									page: search.page + 1,
									limit: search.limit,
									searchPhrase: search.searchPhrase,
								},
							}}
							viewTransition
						>
							<Button size="large" fullWidth variant="outlined">
								Load More Stages &ensp;
								{`(${(search.previousStages?.length ?? 0) + stages.limit} of ${stages.length})`}
							</Button>
						</Link>
					) : (
						<Typography variant="h5" textAlign="center">
							No more stages. <br />
							<Link to=".">
								Clear filter and back to first page
							</Link>
						</Typography>
					)}
				</Box>
			</Stack>
			<ClientOnly>
				<ScrollTop />
			</ClientOnly>
		</>
	);
}
