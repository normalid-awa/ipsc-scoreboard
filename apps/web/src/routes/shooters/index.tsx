import { ShooterCard } from "@/components/ShooterCard";
import { SportFilter } from "@/components/SportFilter";
import env from "@/env";
import { ListedRouteStaticData } from "@/router";
import { FieldFilter, SportEnum } from "@ipsc_scoreboard/api";
import PeopleIcon from "@mui/icons-material/People";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { debounce } from "@mui/material/utils";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

const shootersSearchSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
	sports: z.array(z.nativeEnum(SportEnum)).optional(),
	search: z.string().optional(),
});

export const Route = createFileRoute("/shooters/")({
	component: RouteComponent,
	validateSearch: zodValidator(shootersSearchSchema),
	loaderDeps: ({ search }) => ({ ...search }),
	async loader({ context, deps }) {
		return (
			await context.api["shooter-profile"].get({
				query: {
					pagination: {
						limit: deps.limit,
						offset: (deps.page - 1) * deps.limit,
					},
					filter: {
						operator: "and",
						value: [
							...emptyArrayOrNot(deps.sports != undefined, {
								field: "sport",
								operator: "in",
								value: deps.sports!,
							} satisfies FieldFilter),
							{
								operator: "or",
								value: [
									...emptyArrayOrNot(
										deps.search != undefined,
										{
											field: "user.name",
											operator: "like",
											value: `%${deps.search!}%`,
										} satisfies FieldFilter,
									),
									...emptyArrayOrNot(
										deps.search != undefined,
										{
											field: "identifier",
											operator: "like",
											value: `%${deps.search!}%`,
										} satisfies FieldFilter,
									),
								],
							},
						],
					},
				},
			})
		).data!;
	},
	staticData: {
		displayName: "Shooters list",
		icon: <PeopleIcon />,
		needAuth: false,
		order: 1,
	} satisfies ListedRouteStaticData,
	head: () => ({
		meta: [{ title: `${env.VITE_TITLE_PREFIX} Shooters list` }],
	}),
});

function TextFilter(props: {
	text: string;
	setFilter: (text: string) => void;
}) {
	const debouncedSearch = debounce(
		(searchPhrase: string) => props.setFilter(searchPhrase),
		500,
	);
	return (
		<TextField
			label="Search"
			defaultValue={props.text}
			onChange={(e) => debouncedSearch(e.currentTarget.value)}
			onBlur={(e) => props.setFilter(e.currentTarget.value)}
		/>
	);
}

function emptyArrayOrNot<V>(cond: boolean, ret: V): [V] | [] {
	return cond ? [ret] : [];
}

function RouteComponent() {
	const theme = useTheme();
	const smallVariant = useMediaQuery(theme.breakpoints.down("sm"));
	const data = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const search = Route.useSearch();

	return (
		<>
			<Stack sx={{ height: "100%" }} spacing={1}>
				<Typography variant="h4">Shooters</Typography>
				<Paper elevation={3}>
					<Stack spacing={1} sx={{ p: 2 }}>
						<TextFilter
							text={search.search ?? ""}
							setFilter={(searchStr) =>
								navigate({
									search: {
										...search,
										search: searchStr,
									},
								})
							}
						/>
						<SportFilter
							filters={search.sports ?? []}
							setFilters={(sports) => {
								navigate({
									search: {
										sports:
											sports.length == 0
												? undefined
												: sports,
									},
								});
							}}
						/>
					</Stack>
				</Paper>
				<Paper
					variant="outlined"
					sx={{ flexGrow: 1, overflow: "auto", minHeight: 200 }}
				>
					<Stack spacing={1} sx={{ p: 1 }}>
						{data.items.map((v) => {
							return (
								<ShooterCard
									size="medium"
									key={v.id}
									icon={
										v.image
											? `${env.VITE_BACKEND_API_URL}/api/image/${v.image?.uuid}`
											: undefined
									}
									identifier={v.identifier}
									sport={v.sport}
								/>
							);
						})}
					</Stack>
					{data.items.length === 0 && (
						<Typography sx={{ pt: 5 }} variant="h2" align="center">
							{`No shooters found : (`}
						</Typography>
					)}
				</Paper>
				<div
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<TablePagination
						component="div"
						count={data.totalPages * data.limit}
						page={search.page - 1}
						onPageChange={(_, page) =>
							navigate({
								search: {
									...search,
									page: page + 1,
								},
							})
						}
						rowsPerPage={search.limit}
						onRowsPerPageChange={(e) =>
							navigate({
								search: {
									...search,
									limit: parseInt(e.target.value, 10),
									page: 1,
								},
							})
						}
					/>
				</div>
			</Stack>
		</>
	);
}
