import env from "@/env";
import { FrontendStageModules } from "@/stageModules/stageModules";
import { SportEnum, UnionStage } from "@ipsc_scoreboard/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/stages/$stageId")({
	component: RouteComponent,
	async loader(ctx) {
		const stage = await ctx.context.api
			.stage({ id: ctx.params.stageId })
			.get({
				query: {
					populate: ["creator.image", "creator.name"],
				},
			})
			.then((res) => res.data);
		if (!stage) throw notFound();
		return stage;
	},
});

function BaseStageInformation({
	stage,
	dense,
}: {
	stage: UnionStage;
	dense: boolean;
}) {
	return (
		<>
			<Table size={dense ? "small" : "medium"}>
				<TableBody>
					<TableRow>
						<TableCell scope="row" align="right">
							Creator
						</TableCell>
						<TableCell>
							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Avatar
									src={stage.creator.image}
									sx={{ mr: 1, height: 32, width: 32 }}
								>
									{stage.creator.name[0]}
								</Avatar>
								<Typography variant="h6">
									{stage.creator.name}
								</Typography>
							</Box>
						</TableCell>
					</TableRow>
					{(
						[
							[
								"Description:",
								stage.description || "No description",
							],
							["Minimum rounds:", stage.minimumRounds],
							[
								"Walkthrough time:",
								`${stage.walkthroughTime} seconds (${(stage.walkthroughTime / 60).toFixed(2)} minutes)`,
							],
						] as const
					).map(([head, cell]) => (
						<TableRow key={head as string}>
							<TableCell scope="row" align="right">
								{head}
							</TableCell>
							<TableCell sx={{ minWidth: 200 }}>{cell}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

function StageInformation({
	stage,
	dense,
}: {
	stage: UnionStage;
	dense: boolean;
}) {
	const [expandInfo, setExpandInfo] = useState(true);

	return (
		<>
			<BaseStageInformation stage={stage} dense={dense} />
			<Accordion
				expanded={expandInfo}
				onChange={() => setExpandInfo(!expandInfo)}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component="span">Stage info.</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ mt: -2 }}>
					{FrontendStageModules[SportEnum[stage.type]](
						stage,
					).stageInfoDisplay()}
				</AccordionDetails>
			</Accordion>
		</>
	);
}

function RouteComponent() {
	const dense = useMediaQuery((t) => t.breakpoints.down("sm"));
	const stage = Route.useLoaderData() as UnionStage;

	return (
		<>
			<Grid container spacing={1} sx={{ height: "100%" }}>
				<Grid size={{ xs: 12, md: 4 }} height={"100%"}>
					<Paper
						elevation={3}
						sx={{
							height: "100%",
							overflow: "auto",
						}}
					>
						<Stack>
							<CardMedia
								sx={{
									borderStartStartRadius: (t) =>
										t.vars?.shape.borderRadius,
									borderStartEndRadius: (t) =>
										t.vars?.shape.borderRadius,
								}}
								component="img"
								image={
									stage.images?.length > 0
										? `${env.VITE_BACKEND_API_URL}/api/image/${stage.images[0].uuid}`
										: undefined
								}
								alt={`${stage.title}'s thumbnail`}
								style={{
									viewTransitionName: `stage-image-${stage.id}`,
								}}
							/>
							<StageInformation stage={stage} dense={dense} />
						</Stack>
					</Paper>
				</Grid>
				<Grid size={"grow"}>Statistics placeholder</Grid>
				<Grid size={{ xs: 4, md: 2 }}>Modify option placeholder</Grid>
			</Grid>
		</>
	);
}
