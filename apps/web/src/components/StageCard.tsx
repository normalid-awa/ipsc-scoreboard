import { UnionStage } from "@ipsc_scoreboard/api";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ExpandMoreButton } from "./ExpandMoreButton";
import { useState } from "react";
import env from "@/env";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import { CardOnClickWrapper } from "./CardOnClickWrapper";
import CardActions from "@mui/material/CardActions";

export interface StageCardProps {
	onClick?: () => void;
	creator: {
		name: string;
		image?: string;
	};
	stage: UnionStage;
}

export function StageCard(props: StageCardProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<>
			<Card sx={{ overflow: "visible" }}>
				<CardOnClickWrapper onClick={props.onClick}>
					<CardHeader
						avatar={
							<Avatar
								sx={{ bgcolor: red[500] }}
								aria-label="recipe"
								src={props.creator.image}
							>
								{props.creator.name[0]}
							</Avatar>
						}
						action={
							<IconButton aria-label="settings">
								<MoreVertIcon />
							</IconButton>
						}
						title={`${props.creator.name}`}
						subheader={`${props.stage.type} Stage`}
					/>
					{props.stage.images.length > 0 && (
						<CardMedia
							component="img"
							image={`${env.VITE_BACKEND_API_URL}/api/image/${props.stage.images[0].uuid}`}
							alt={`Stage ${props.stage.title}'s thumbnail`}
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
							<ExpandMoreButton
								sx={{
									width: "2.5rem",
									height: "2.5rem",
								}}
								expanded={expanded}
								onClick={() => setExpanded(!expanded)}
							/>
						</Box>
					</CardContent>
				</CardOnClickWrapper>
				<CardActions sx={{ p: 0, m: 0 }}>
					<Collapse
						in={expanded}
						timeout="auto"
						unmountOnExit
						sx={{ flexGrow: 1 }}
					>
						<Paper variant="outlined">
							{props.stage.description}
						</Paper>
					</Collapse>
				</CardActions>
			</Card>
		</>
	);
}
