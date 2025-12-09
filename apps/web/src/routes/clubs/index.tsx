import { authClient } from "@/auth/auth.client";
import { FeaturePlaceHolder } from "@/components/FeaturePlaceholder";
import env from "@/env";
import { ListedRouteStaticData } from "@/router";
import { getCookie } from "@/utils/getHeaders";
import { getImageUrlFromId } from "@/utils/imageApi";
import { EntityDTO, ShooterProfile } from "@ipsc_scoreboard/api";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/clubs/")({
	component: RouteComponent,
	staticData: {
		displayName: "Club list",
		icon: <Diversity2Icon />,
		needAuth: false,
		order: 1,
	} satisfies ListedRouteStaticData,
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

		return {
			shooterProfiles:
				shooterProfiles as unknown as EntityDTO<ShooterProfile>[],
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
							sx={{ maxWidth: 450, width: "100%", minWidth: 250 }}
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
											filter: "drop-shadow(2px 4px 25px black)",
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
										<p
											style={{
												fontWeight: "bold",
												display: "inline",
											}}
										>
											{profile.club?.name}
										</p>
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

function Clubs() {
	return <FeaturePlaceHolder name="Clubs" />;
}

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<Stack spacing={1}>
			<CurrentClub shooterProfiles={data.shooterProfiles} />
			<SearchFilter />
			<Clubs />
		</Stack>
	);
}
