import { useSession } from "@/auth/auth.client";
import { Carousel } from "@/components/Carousel";
import env from "@/env";
import { FrontendStageModules } from "@/stageModules/stageModules";
import { EntityDTO, SportEnum, UnionStage } from "@ipsc_scoreboard/api";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
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
import { ReactElement, useState } from "react";

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
		return stage as unknown as EntityDTO<UnionStage>;
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
	const [expandInfo, setExpandInfo] = useState(false);

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

function ModifyOptionsButton(
	props: {
		icon: ReactElement;
		iconOnly?: boolean;
		children: ReactElement | string;
	} & ButtonProps,
) {
	const { icon, iconOnly, children, ...buttonProps } = props;
	if (props.iconOnly)
		return (
			<Button fullWidth {...buttonProps}>
				{props.icon}
			</Button>
		);
	else
		return (
			<Button fullWidth {...buttonProps} startIcon={props.icon}>
				{props.children}
			</Button>
		);
}

function ModifyOptions(props: { onEdit: () => void; onDelete: () => void }) {
	const hideIcon = useMediaQuery((t) => t.breakpoints.down("sm"));
	return (
		<ButtonGroup fullWidth orientation="vertical">
			<ModifyOptionsButton
				icon={<EditIcon />}
				iconOnly={hideIcon}
				onClick={props.onEdit}
			>
				Edit
			</ModifyOptionsButton>
			<ModifyOptionsButton
				icon={<DeleteIcon />}
				iconOnly={hideIcon}
				color="error"
				onClick={props.onDelete}
			>
				Delete
			</ModifyOptionsButton>
		</ButtonGroup>
	);
}

function RouteComponent() {
	const dense = useMediaQuery((t) => t.breakpoints.down("sm"));
	const stage = Route.useLoaderData() as UnionStage;
	const { data: session } = useSession();
	const to = Route.useNavigate();

	function onDelete() {}

	function onEdit() {
		to({
			to: "/stages/create",
			search: {
				edit: stage.id,
			},
		});
	}

	return (
		<>
			<Grid container spacing={1}>
				<Grid
					size={{ xs: 12, md: 4 }}
					height={dense ? "100%" : "unset"}
				>
					<Paper
						elevation={3}
						sx={{
							height: "100%",
							overflow: dense ? "auto" : "initial",
						}}
					>
						<Stack>
							{stage.images?.length > 0 && (
								<Carousel
									direction={"row"}
									sx={{
										width: "100%",
										viewTransitionName: `stage-image-${stage.id}`,
									}}
								>
									{stage.images.map((image) => (
										<CardMedia
											component="img"
											loading="lazy"
											image={`${env.VITE_BACKEND_API_URL}/api/image/${image.uuid}`}
											alt={`${stage.title}'s thumbnail`}
										/>
									))}
								</Carousel>
							)}
							<StageInformation stage={stage} dense={dense} />
						</Stack>
					</Paper>
				</Grid>
				<Grid size={"grow"}>Statistics placeholder</Grid>
				{session?.user.id == stage.creator.id && (
					<Grid size={{ xs: 2, lg: 1, md: 2 }}>
						<Paper sx={{ p: 1 }} elevation={4}>
							<ModifyOptions
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						</Paper>
					</Grid>
				)}
			</Grid>
		</>
	);
}
