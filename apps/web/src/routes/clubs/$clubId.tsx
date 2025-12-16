import { FeaturePlaceHolder } from "@/components/FeaturePlaceholder";
import env from "@/env";
import { getImageUrlFromId } from "@/utils/imageApi";
import { Club, EntityDTO } from "@ipsc_scoreboard/api";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useConfirm } from "material-ui-confirm";
import z from "zod";

const tabs = z.union([z.literal("members"), z.literal("statistics")]);

const clubDetailsSearchScheme = z.object({
	tab: z.optional(tabs).default("members"),
});

export const Route = createFileRoute("/clubs/$clubId")({
	component: RouteComponent,
	validateSearch: zodValidator(clubDetailsSearchScheme),
	loaderDeps: ({ ...search }) => ({ ...search }),
	async loader(ctx) {
		const club = (
			await ctx.context.api.club({ clubId: ctx.params.clubId }).get()
		).data as unknown as EntityDTO<Club>;
		if (!club) throw notFound();
		return club;
	},
	head: (ctx) => ({
		meta: [
			{
				title: `${env.VITE_TITLE_PREFIX} Viewing Club: ${ctx.params.clubId}`,
			},
		],
	}),
});

const ICON_SIZE = 120;

function RouteComponent() {
	const club = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const confirm = useConfirm();

	return (
		<Container maxWidth="md">
			<Stack spacing={2}>
				<Box
					component={"img"}
					src={getImageUrlFromId(club.banner?.uuid)}
					sx={{
						maxHeight: 320,
						width: "100%",
						objectFit: "cover",
						borderRadius: (t) => t.shape.borderRadius,
					}}
				/>
				<Paper
					sx={{
						p: 2,
						position: "sticky",
						top: 60,
					}}
				>
					<Stack direction={"row"}>
						<Box
							component="img"
							src={getImageUrlFromId(club.icon.uuid)}
							sx={{
								width: ICON_SIZE,
								height: ICON_SIZE,
								objectFit: "cover",
								borderRadius: "100%",
							}}
						/>
						<Stack
							sx={{ flexGrow: 1 }}
							justifyContent="space-evenly"
						>
							<Typography px={2} variant="h4">
								{club.name}
							</Typography>
							<Typography
								px={2}
								variant="button"
								color="textSecondary"
							>
								{
									//@ts-expect-error
									club.sport
								}
							</Typography>
						</Stack>
						<Card
							variant="outlined"
							sx={{
								width: "50%",
								height: ICON_SIZE,
								gridArea: "span 2",
							}}
						>
							<CardActionArea
								sx={{ p: 1 }}
								onClick={() =>
									confirm({
										hideCancelButton: true,
										title: "Description",
										content: club.description,
									})
								}
							>
								<Typography variant="overline">
									Description:
								</Typography>
								<Typography px={0.5}>
									{club.description}
								</Typography>
							</CardActionArea>
						</Card>
					</Stack>
				</Paper>
				<Paper sx={{ height: 60 }}>
					<FeaturePlaceHolder name={"Actions group"} />
				</Paper>
				<Paper>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={search.tab}
							onChange={(_, v) =>
								navigate({
									search: {
										...search,
										tab: v,
									},
								})
							}
							aria-label="basic tabs example"
						>
							{tabs._def.options.map((v) => (
								<Tab
									label={v.value}
									key={v.value}
									value={v.value}
								/>
							))}
						</Tabs>
					</Box>
				</Paper>
			</Stack>
		</Container>
	);
}
