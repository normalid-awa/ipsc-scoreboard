import { ButtonLink, Link } from "@/components/MuiWrapper";
import { SportFilter } from "@/components/SportFilter";
import { StageCard } from "@/components/StageCard";
import { ListedRouteStaticData } from "@/router";
import { wrapArray } from "@/utils/wrapArray";
import {
	App,
	FieldFilter,
	LogicalFilters,
	PaginatedResult,
	SportEnum,
	UnionStage,
} from "@ipsc_scoreboard/api";
import SnippetFolderIcon from "@mui/icons-material/SnippetFolder";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { debounce } from "@mui/material/utils";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

const MINIMUM_ROUNDS_INFINITY = 40;

const stageSearchSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(20).default(10),
	previousStages: z.optional(z.array(z.custom<UnionStage>())),
	sportFilter: z.optional(z.array(z.nativeEnum(SportEnum)).default([])),
	searchPhrase: z.optional(z.string().max(100)).default(""),
	minimumRounds: z
		.optional(z.tuple([z.number(), z.number()]))
		.default([0, MINIMUM_ROUNDS_INFINITY]),
});

export const Route = createFileRoute("/stages/")({
	component: RouteComponent,
	validateSearch: zodValidator(stageSearchSchema),
	loaderDeps: ({ search }) => ({ ...search }),
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
							...wrapArray(deps.minimumRounds?.length == 2, {
								operator: "and",
								value: [
									{
										field: "minimumRounds",
										operator: "gte",
										value: deps.minimumRounds![0],
									},
									{
										field: "minimumRounds",
										operator: "lte",
										value:
											deps.minimumRounds![1] ===
											MINIMUM_ROUNDS_INFINITY
												? 1000
												: deps.minimumRounds![1],
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
	staticData: {
		displayName: "Stages list",
		icon: <SnippetFolderIcon />,
		needAuth: false,
		order: 2,
	} satisfies ListedRouteStaticData,
});

function FilterBar() {
	const smallVariant = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	const debouncedSearch = debounce(
		(searchPhrase: string) =>
			navigate({
				to: ".",
				search: ({ previousStages, ...old }) => ({
					...old,
					page: 1,
					searchPhrase,
				}),
				mask: {
					search: ({ previousStages, ...old }) => ({
						...old,
						page: 1,
						searchPhrase,
					}),
				},
				viewTransition: true,
			}),
		500,
	);

	const debouncedminimumRounds = debounce(
		(minimumRounds: [number, number]) =>
			navigate({
				to: ".",
				search: ({ previousStages, ...old }) => ({
					...old,
					page: 1,
					minimumRounds,
				}),
				mask: {
					search: ({ previousStages, ...old }) => ({
						...old,
						page: 1,
						minimumRounds,
					}),
				},
				viewTransition: true,
			}),
		200,
	);

	return (
		<Paper>
			<Stack spacing={1} sx={{ p: smallVariant ? 0 : 1 }}>
				<Grid container spacing={{ md: 2, xs: 1 }}>
					<Grid size="grow">
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
					</Grid>
					<Grid size={{ sm: 4, md: 3, lg: 2 }}>
						<ButtonLink
							to="/stages/create"
							fullWidth
							variant="outlined"
							sx={{ height: "100%" }}
						>
							Create Stage
						</ButtonLink>
					</Grid>
				</Grid>
				<Grid
					container
					spacing={{ md: 2, xs: 1 }}
					alignItems={"center"}
				>
					<Grid size={{ md: "auto", xs: 12 }}>
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
										search: ({
											previousStages,
											...old
										}) => ({
											...old,
											page: 1,
											sportFilter: filters,
										}),
									},
									viewTransition: true,
								});
							}}
						/>
					</Grid>
					<Grid size={{ md: "grow", xs: 12 }}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								mx: 2,
							}}
						>
							<Typography
								variant="subtitle2"
								sx={{ mr: 2, whiteSpace: "nowrap" }}
							>
								Minimum Rounds:
							</Typography>
							<Slider
								size={smallVariant ? "small" : "medium"}
								onChange={(_, value) =>
									debouncedminimumRounds(
										value as [number, number],
									)
								}
								defaultValue={
									search.minimumRounds || [
										0,
										MINIMUM_ROUNDS_INFINITY,
									]
								}
								valueLabelDisplay="auto"
								min={0}
								step={1}
								max={MINIMUM_ROUNDS_INFINITY}
								valueLabelFormat={(v) =>
									v === MINIMUM_ROUNDS_INFINITY ? "∞" : v
								}
								disableSwap
							/>
						</Box>
					</Grid>
				</Grid>
			</Stack>
		</Paper>
	);
}

function ScrollTop() {
	const showScrollToTopButton = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});
	const largeFab = useMediaQuery((theme) => theme.breakpoints.up("md"));

	return (
		<Zoom in={showScrollToTopButton} unmountOnExit>
			<Fab
				sx={{
					position: "fixed",
					bottom: (t) => t.spacing(largeFab ? 4 : 3),
					right: (t) => t.spacing(largeFab ? 4 : 3),
				}}
				aria-label="Scroll back to top"
				color="primary"
				size={largeFab ? "large" : "medium"}
				variant={largeFab ? "extended" : "circular"}
				onClick={() => {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
			>
				<VerticalAlignTopIcon />
				{largeFab && "Scroll to top"}
			</Fab>
		</Zoom>
	);
}

function RouteComponent() {
	const stages =
		Route.useLoaderData() as unknown as PaginatedResult<UnionStage>;
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<>
			<Stack spacing={1}>
				<FilterBar />
				{stages.items.length > 0 && (
					<Masonry
						sx={{ maxWidth: "100%" }}
						columns={{ xs: 1, sm: 2, md: 4, lg: 5 }}
						spacing={0.5}
						defaultHeight={1000}
						defaultColumns={4}
						defaultSpacing={1}
						sequential
					>
						{stages.items.map((stage) => {
							return (
								<StageCard
									onClick={() =>
										navigate({
											to: "/stages/$stageId",
											params: {
												stageId: stage.id.toString(),
											},
											viewTransition: true,
										})
									}
									key={stage.id}
									stage={stage}
									cardProps={{
										sx: {
											width: "calc(100%/5)",
										},
										style: {
											viewTransitionName: `stage-card-${stage.id}`,
										},
									}}
								/>
							);
						})}
					</Masonry>
				)}
			</Stack>
			<Box>
				{stages.hasNextPage ? (
					<Link
						to="."
						search={(old) => ({
							...old,
							previousStages: stages.items,
							page: search.page + 1,
						})}
						mask={{
							to: ".",
							search: ({ previousStages, ...old }) => ({
								...old,
								page: (old.page || 1) + 1,
							}),
						}}
						resetScroll={false}
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
						<Link to=".">Clear filter and back to first page</Link>
					</Typography>
				)}
			</Box>
			<ClientOnly>
				<ScrollTop />
			</ClientOnly>
		</>
	);
}
