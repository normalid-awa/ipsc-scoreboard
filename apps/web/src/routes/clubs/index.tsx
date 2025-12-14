import { authClient } from "@/auth/auth.client";
import { SportFilter } from "@/components/SportFilter";
import env from "@/env";
import { ListedRouteStaticData } from "@/router";
import { getCookie } from "@/utils/getHeaders";
import { getImageUrlFromId } from "@/utils/imageApi";
import { wrapArray } from "@/utils/wrapArray";
import {
	Club,
	EntityDTO,
	FieldFilter,
	PaginatedResult,
	ShooterProfile,
	SportEnum,
} from "@ipsc_scoreboard/api";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { debounce } from "@mui/material/utils";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

const clubSearchSchema = z.object({
	search: z.optional(z.string()),
	sports: z.optional(z.array(z.nativeEnum(SportEnum))),
	sortBy: z
		.optional(
			z.union([
				z.literal("createdAt"),
				z.literal("name"),
				z.literal("membersCount"),
			]),
		)
		.default("createdAt"),
	sortDirection: z
		.optional(z.union([z.literal("ASC"), z.literal("DESC")]))
		.default("DESC"),
	page: z.optional(z.number()).default(1),
});

export const Route = createFileRoute("/clubs/")({
	component: RouteComponent,
	staticData: {
		displayName: "Club list",
		icon: <Diversity2Icon />,
		needAuth: false,
		order: 1,
	} satisfies ListedRouteStaticData,
	validateSearch: zodValidator(clubSearchSchema),
	loaderDeps: ({ search }) => ({ ...search }),
	async loader(ctx) {
		const session = await authClient.getSession({
			fetchOptions: {
				headers: {
					Cookie: getCookie(),
				},
			},
		});
		const shooterProfiles = session.data?.user
			? (
					await ctx.context.api["shooter-profile"].get({
						query: {
							filter: {
								operator: "and",
								value: [
									{
										field: "user.id",
										operator: "eq",
										value: session.data?.user.id,
									},
								],
							},
							populate: ["club"],
						},
					})
				).data?.items
			: [];

		const clubs = (
			await ctx.context.api.club.get({
				query: {
					filter: {
						operator: "and",
						value: [
							{
								operator: "or",
								value: [
									...wrapArray(!!ctx.deps.search, {
										field: "name",
										operator: "like",
										value: `%${ctx.deps.search!}%`,
									} satisfies FieldFilter),
									...wrapArray(!!ctx.deps.search, {
										field: "description",
										operator: "like",
										value: `%${ctx.deps.search!}%`,
									} satisfies FieldFilter),
								],
							},
							...wrapArray((ctx.deps.sports?.length ?? 0) > 0, {
								field: "sport",
								operator: "in",
								value: ctx.deps.sports!,
							} satisfies FieldFilter),
						],
					},
					pagination: {
						sortField: ctx.deps.sortBy ?? "createdAt",
						sortDirection: ctx.deps.sortDirection ?? "DESC",
					},
				},
			})
		).data;

		return {
			shooterProfiles:
				shooterProfiles as unknown as EntityDTO<ShooterProfile>[],
			clubs: clubs as unknown as PaginatedResult<EntityDTO<Club>>,
		};
	},
	head: () => ({
		meta: [{ title: `${env.VITE_TITLE_PREFIX} Club list` }],
	}),
});

function CurrentClub(props: { shooterProfiles: EntityDTO<ShooterProfile>[] }) {
	return (
		<Accordion defaultExpanded>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant="button">Clubs you joined:</Typography>
			</AccordionSummary>
			<AccordionDetails>
				{props.shooterProfiles.length == 0 && (
					<Typography variant="button" textAlign="center">
						You haven't joined any club yet
					</Typography>
				)}
				<Stack
					direction="row"
					justifyContent="space-evenly"
					sx={{ overflowX: "auto" }}
				>
					{props.shooterProfiles.map((profile) => (
						<Card
							key={profile.id}
							elevation={5}
							sx={{
								maxWidth: 450,
								width: "100%",
								minWidth: 250,
								mb: 2,
							}}
						>
							<CardActionArea>
								<CardMedia
									sx={{ height: 120 }}
									image={getImageUrlFromId(
										profile.club?.banner?.uuid,
									)}
								/>
								<CardContent sx={{ position: "relative" }}>
									<Avatar
										src={getImageUrlFromId(
											profile.club?.icon.uuid,
										)}
										sx={{
											position: "absolute",
											height: 100,
											width: 100,
											top: -20,
											left: "50%",
											transform:
												"translateX(-50%) translateY(-50%)",
											boxShadow: (theme) =>
												theme.shadows[5],
										}}
									/>
									<Typography
										sx={{ mt: 3 }}
										display={"block"}
										width="100%"
										variant="overline"
										textAlign="center"
										color="textPrimary"
									>
										{profile.sport}
									</Typography>
									<Typography variant="h5" align="center">
										You are the member of{" "}
										<Typography
											fontWeight="bold"
											display="inline"
											variant="h5"
											component={"span"}
											color="primary"
										>
											{profile.club?.name}
										</Typography>
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					))}
				</Stack>
			</AccordionDetails>
		</Accordion>
	);
}

function SearchFilter() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const deboucedSearch = debounce((str) => {
		navigate({
			search: {
				...search,
				search: str,
				page: 1,
			},
			viewTransition: true,
		});
	}, 200);

	return (
		<Paper>
			<Grid container spacing={1} sx={{ p: 1 }}>
				<Grid size={{ xs: 6, sm: 8, lg: 10 }}>
					<TextField
						label="Search"
						placeholder="Search..."
						fullWidth
						slotProps={{
							input: {
								endAdornment: <SearchIcon />,
							},
						}}
						defaultValue={search.search}
						onChange={(e) => deboucedSearch(e.currentTarget.value)}
					/>
				</Grid>
				<Grid size={{ xs: 3, sm: 2, lg: 1 }}>
					<FormControl fullWidth>
						<InputLabel>Sort by</InputLabel>
						<Select
							label="Sort By"
							value={search.sortBy}
							onChange={(e) => {
								navigate({
									search: {
										...search,
										sortBy: e.target.value,
										page: 1,
									},
									viewTransition: true,
								});
							}}
						>
							<MenuItem value={"name"}>Name</MenuItem>
							<MenuItem value={"membersCount"}>Members</MenuItem>
							<MenuItem value={"createdAt"}>Create date</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 3, sm: 2, lg: 1 }}>
					<FormControl fullWidth>
						<InputLabel>Sort direction</InputLabel>
						<Select
							label="Sort direction"
							value={search.sortDirection}
							onChange={(e) => {
								navigate({
									search: {
										...search,
										sortDirection: e.target.value,
										page: 1,
									},
									viewTransition: true,
								});
							}}
						>
							<MenuItem value={"DESC"}>Descending</MenuItem>
							<MenuItem value={"ASC"}>Ascending</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 9, sm: 8, lg: 10 }}>
					<SportFilter
						filters={search.sports ?? []}
						setFilters={(v) =>
							navigate({
								search: {
									...search,
									page: 1,
									sports: v,
								},
								viewTransition: true,
							})
						}
					/>
				</Grid>
				<Grid size={{ xs: 3, sm: 4, lg: 2 }}>
					<Button
						fullWidth
						variant="outlined"
						color={"inherit"}
						onClick={() =>
							navigate({ search: {}, viewTransition: true })
						}
					>
						Reset
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}

function ClubCard({ club }: { club: EntityDTO<Club> }) {
	const compact = useMediaQuery((t) => t.breakpoints.down("sm"));
	return (
		<Card
			key={club.id}
			sx={{
				width: "100%",
				viewTransitionName: `club-card-transition-${club.id}`,
			}}
			elevation={5}
		>
			<CardActionArea LinkComponent={"a"}>
				<Grid container spacing={1}>
					<Grid size={compact ? 12 : "auto"}>
						<Box
							component="img"
							loading="lazy"
							src={getImageUrlFromId(club.banner?.uuid)}
							sx={{
								height: compact ? undefined : "100%",
								maxHeight: compact ? undefined : 250,
								width: compact ? "100%" : undefined,
							}}
						/>
					</Grid>
					<Grid size="grow" sx={{ p: 1 }}>
						<Stack spacing={2}>
							<Stack
								direction="row"
								alignItems={"center"}
								spacing={2}
							>
								<Avatar
									sx={{
										height: compact ? 50 : 75,
										width: compact ? 50 : 75,
									}}
									src={getImageUrlFromId(club.icon.uuid)}
								/>
								<Stack>
									<Typography variant="h4" fontWeight={400}>
										{club.name}
									</Typography>
									<Typography
										variant="button"
										color="textSecondary"
									>
										{
											//@ts-expect-error
											club.sport as SportEnum
										}
									</Typography>
								</Stack>
								<Typography
									variant="overline"
									align="right"
									flexGrow={1}
									pr={2}
								>
									Members: {club.membersCount}
								</Typography>
							</Stack>
							<Paper variant="outlined">
								<Accordion defaultExpanded={!compact}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
									>
										<Typography variant="button">
											Description
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Typography>
											{club.description}
										</Typography>
									</AccordionDetails>
								</Accordion>
							</Paper>
						</Stack>
					</Grid>
				</Grid>
			</CardActionArea>
		</Card>
	);
}

function Clubs(props: { clubs: EntityDTO<Club>[] }) {
	return (
		<Stack spacing={2}>
			{props.clubs.map((club) => (
				<ClubCard club={club} key={club.id} />
			))}
		</Stack>
	);
}

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<Stack spacing={1}>
			<CurrentClub shooterProfiles={data.shooterProfiles} />
			<SearchFilter />
			<Clubs clubs={data.clubs.items} />
		</Stack>
	);
}
