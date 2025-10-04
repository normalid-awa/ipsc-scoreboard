import env from "@/env";
import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	SportEnum,
	UnionStage,
	UspsaStage,
} from "@ipsc_scoreboard/api";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createFileRoute, notFound } from "@tanstack/react-router";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import { useState } from "react";
import AccordionDetails from "@mui/material/AccordionDetails";

export const Route = createFileRoute("/stages/$stageId")({
	component: RouteComponent,
	async loader(ctx) {
		const stage = await ctx.context.api
			.stage({ id: ctx.params.stageId })
			.get()
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

function IpscStageInformation({
	stage,
	dense,
}: {
	stage: IpscStage;
	dense: boolean;
}) {
	return (
		<Stack sx={{ p: 1 }}>
			<Typography variant="h5">Stage type: {stage.stageType}</Typography>
			<Grid container>
				<Grid size={{ xs: 12, sm: "auto", md: 12 }}>
					<Typography variant="h6">
						Paper targets ({stage.ipscPaperTargets.length})
					</Typography>
					<Table size={"small"}>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Required shots</TableCell>
								<TableCell>Has noshoot</TableCell>
								<TableCell>No penalty miss</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stage.ipscPaperTargets.map((target) => (
								<TableRow key={target.targetId}>
									<TableCell scope="row" width={20}>
										#{target.targetId}
									</TableCell>
									<TableCell>{target.requiredHits}</TableCell>
									<TableCell>
										{target.hasNoShoot ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
									<TableCell>
										{target.isNoPenaltyMiss ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
				<Grid size={{ xs: 12, sm: "grow", md: 12 }}>
					<Typography variant="h6">
						Steel targets / Poppers ({stage.ipscSteelTargets.length}
						)
					</Typography>
					<Table size={"small"}>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Is noshoots</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stage.ipscSteelTargets.map((target) => (
								<TableRow key={target.targetId}>
									<TableCell scope="row" width={20}>
										#{target.targetId}
									</TableCell>
									<TableCell>
										{target.isNoShoot ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		</Stack>
	);
}

function IdpaStageInformation({
	stage,
	dense,
}: {
	stage: IdpaStage;
	dense: boolean;
}) {
	return (
		<Stack sx={{ p: 1 }}>
			<Grid container>
				<Grid size={12}>
					<Typography variant="h6">
						Paper tagets: {stage.idpaPaperTargets}
					</Typography>
				</Grid>
				<Grid size={12}>
					<Typography variant="h6">
						Steel targets / Poppers: {stage.idpaSteelTargets}
					</Typography>
				</Grid>
			</Grid>
		</Stack>
	);
}

function AaipscStageInformation({
	stage,
	dense,
}: {
	stage: AaipscStage;
	dense: boolean;
}) {
	return (
		<Stack sx={{ p: 1 }}>
			<Typography variant="h5">Stage type: {stage.stageType}</Typography>
			<Grid container>
				<Grid size={{ xs: 12, sm: "auto", md: 12 }}>
					<Typography variant="h6">
						Paper targets ({stage.aaipscPaperTargets.length})
					</Typography>
					<Table size={"small"}>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Required shots</TableCell>
								<TableCell>Has noshoot</TableCell>
								<TableCell>No penalty miss</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stage.aaipscPaperTargets.map((target) => (
								<TableRow key={target.targetId}>
									<TableCell scope="row" width={20}>
										#{target.targetId}
									</TableCell>
									<TableCell>{target.requiredHits}</TableCell>
									<TableCell>
										{target.hasNoShoot ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
									<TableCell>
										{target.isNoPenaltyMiss ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
				<Grid size={{ xs: 12, sm: "auto", md: 12 }}>
					<Typography variant="h6">
						Steel targets / Poppers (
						{stage.aaipscSteelTargets.length})
					</Typography>
					<Table size={"small"}>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Is noshoots</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stage.aaipscSteelTargets.map((target) => (
								<TableRow key={target.targetId}>
									<TableCell scope="row" width={20}>
										#{target.targetId}
									</TableCell>
									<TableCell>
										{target.isNoShoot ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		</Stack>
	);
}

function UspsaStageInformation({
	stage,
	dense,
}: {
	stage: UspsaStage;
	dense: boolean;
}) {
	return (
		<Stack sx={{ p: 1 }}>
			<Typography variant="h5">Stage type: {stage.stageType}</Typography>
			<Typography variant="h5">
				Scoring method: {stage.uspsaScoringMethod}
			</Typography>
			<Grid container>
				<Grid size={{ xs: 12, md: "auto", lg: 12 }}>
					<Typography variant="h6">
						Paper targets ({stage.uspsaPaperTargets.length})
					</Typography>
					<Table size={"small"}>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Required shots</TableCell>
								<TableCell>Has noshoot</TableCell>
								<TableCell>No penalty miss</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stage.uspsaPaperTargets.map((target) => (
								<TableRow key={target.targetId}>
									<TableCell scope="row" width={20}>
										#{target.targetId}
									</TableCell>
									<TableCell>{target.requiredHits}</TableCell>
									<TableCell>
										{target.hasNoShoot ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
									<TableCell>
										{target.isNoPenaltyMiss ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
				<Grid size={{ xs: 12, md: "grow", lg: 12 }}>
					<Typography variant="h6">
						Steel targets / Poppers (
						{stage.uspsaSteelTargets.length})
					</Typography>
					<Table size={"small"}>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Is noshoots</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{stage.uspsaSteelTargets.map((target) => (
								<TableRow key={target.targetId}>
									<TableCell scope="row" width={20}>
										#{target.targetId}
									</TableCell>
									<TableCell>
										{target.isNoShoot ? (
											<CheckIcon />
										) : (
											<ClearIcon />
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		</Stack>
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
				<AccordionDetails>
					{(() => {
						switch (stage.type) {
							case SportEnum.IPSC:
								return (
									<IpscStageInformation
										stage={stage}
										dense={dense}
									/>
								);
							case SportEnum.IDPA:
								return (
									<IdpaStageInformation
										stage={stage}
										dense={dense}
									/>
								);
							case SportEnum.AAIPSC:
								return (
									<AaipscStageInformation
										stage={stage}
										dense={dense}
									/>
								);
							case SportEnum.USPSA:
								return (
									<UspsaStageInformation
										stage={stage}
										dense={dense}
									/>
								);
						}
					})()}
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
