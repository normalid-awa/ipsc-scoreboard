import { UnionStage } from "@ipsc_scoreboard/api";
import Avatar from "@mui/material/Avatar";
import Card, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ExpandMoreButton } from "./ExpandMoreButton";
import { useState } from "react";
import env from "@/env";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import { CardOnClickWrapper } from "./CardOnClickWrapper";
import CardActions from "@mui/material/CardActions";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";

export interface StageCardProps {
	onClick?: () => void;
	creator: {
		name: string;
		image?: string;
	};
	stage: UnionStage;
	cardProps?: CardProps;
}

export function StageCard(props: StageCardProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<>
			<Card sx={{ overflow: "visible" }} {...props.cardProps}>
				<CardOnClickWrapper onClick={props.onClick}>
					<CardHeader
						avatar={
							<Avatar
								aria-label="recipe"
								src={props.creator.image}
							>
								{props.creator.name[0]}
							</Avatar>
						}
						title={`${props.creator.name}`}
						subheader={`${props.stage.type} Stage`}
					/>
					{props.stage.images.length > 0 && (
						<CardMedia
							component="img"
							image={`${env.VITE_BACKEND_API_URL}/api/image/${props.stage.images[0].uuid}`}
							alt={`Stage ${props.stage.title}'s thumbnail`}
							style={{
								viewTransitionName: `stage-image-${props.stage.id}`,
							}}
						/>
					)}
					<CardContent>
						<Box sx={{ display: "flex", flexDirection: "row" }}>
							<Box sx={{ flexGrow: 1 }}>
								<Typography
									variant="body1"
									sx={{ lineBreak: "anywhere" }}
								>
									{props.stage.title}
								</Typography>
								<Typography
									variant="caption"
									color="textSecondary"
								>
									{props.stage.createdAt.toLocaleString()}
								</Typography>
							</Box>
							<Box sx={{ width: "calc(2.5rem - 8px)" }} />
						</Box>
					</CardContent>
				</CardOnClickWrapper>
				<Box
					sx={{
						float: "right",
						translate: "-8px calc(-2.5rem - 8px)",
						height: 0,
					}}
				>
					<ExpandMoreButton
						sx={{
							width: "2.5rem",
							height: "2.5rem",
						}}
						expanded={expanded}
						onClick={() => setExpanded(!expanded)}
					/>
				</Box>
				<CardActions sx={{ p: 0, m: 0, flexDirection: "column" }}>
					<Collapse
						in={expanded}
						timeout="auto"
						unmountOnExit
						sx={{ width: "100%" }}
					>
						<Paper
							variant="outlined"
							sx={{
								width: "100%",
							}}
						>
							<Box
								sx={{
									width: "100%",
									overflow: "auto",
								}}
							>
								<Table size="small">
									<TableBody>
										{(
											[
												[
													"Description:",
													props.stage.description ||
														"No description",
												],
												[
													"Minimum rounds:",
													props.stage.minimumRounds,
												],
												[
													"Walkthrough time:",
													`${props.stage.walkthroughTime} seconds`,
												],
											] as const
										).map(([head, cell]) => (
											<TableRow key={head as string}>
												<TableCell
													scope="row"
													align="right"
												>
													{head}
												</TableCell>
												<TableCell
													sx={{ minWidth: 200 }}
												>
													{cell}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Box>
						</Paper>
					</Collapse>
				</CardActions>
			</Card>
		</>
	);
}
