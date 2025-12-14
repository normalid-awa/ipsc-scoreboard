import { authClient } from "@/auth/auth.client";
import { FeaturePlaceHolder } from "@/components/FeaturePlaceholder";
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
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

const clubSearchSchema = z.object({
	search: z.optional(z.string()),
	sport: z.optional(z.array(z.nativeEnum(SportEnum))),
	sortBy: z.optional(
		z.union([
			z.literal("createdAt"),
			z.literal("name"),
			z.literal("members"),
		]),
	),
	sortDirection: z.optional(z.union([z.literal("ASC"), z.literal("DESC")])),
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
							...wrapArray((ctx.deps.sport?.length ?? 0) > 0, {
								field: "sport",
								operator: "in",
								value: ctx.deps.sport!,
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
	return <FeaturePlaceHolder name="Search Filter" />;
}

function ClubCard({ club }: { club: EntityDTO<Club> }) {
	const compact = useMediaQuery((t) => t.breakpoints.down("sm"));
	return (
		<Card
			key={club.id}
			sx={{
				width: "100%",
			}}
			elevation={5}
		>
			<CardActionArea>
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
				<ClubCard club={club} />
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
