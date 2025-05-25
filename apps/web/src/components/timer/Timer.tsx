"use client";

import {
	Avatar,
	Box,
	Button,
	ButtonProps,
	Collapse,
	Grid,
	GridProps,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { TransitionGroup } from "react-transition-group";

interface TimeDisplayProps {
	time: number;
	split: number;
	shot: number;
	totalShots: number;
}
function TimeDisplay(props: TimeDisplayProps) {
	return (
		<Grid container sx={{ height: "100%" }}>
			<Grid size={12} textAlign="center">
				<Typography sx={{ fontWeight: 500 }} variant="h1">
					{props.time.toFixed(2)}
				</Typography>
			</Grid>
			<Grid size={6} textAlign="center">
				<Typography variant="overline">
					Split: {props.split.toFixed(2)}s
				</Typography>
			</Grid>
			<Grid size={6} textAlign="center">
				<Typography variant="overline">
					Shot: #{props.shot} / {props.totalShots}
				</Typography>
			</Grid>
		</Grid>
	);
}

interface ButtonGroupProps {
	disableMenu: boolean;
	disableStart: boolean;
	disableClear: boolean;
	disableReview: boolean;
	onMenuClick: () => void;
	onStartClick: () => void;
	onClearClick: () => void;
	onReviewClick: () => void;
}
function ButtonGroup(props: ButtonGroupProps) {
	const StyledButton = (props: ButtonProps) => (
		<Button
			fullWidth
			size="large"
			sx={{ height: 80 }}
			variant="outlined"
			{...props}
		/>
	);

	return (
		<Grid container spacing={1}>
			<Grid size={6}>
				<StyledButton
					disabled={props.disableMenu}
					onClick={props.onMenuClick}
				>
					Menu
				</StyledButton>
			</Grid>
			<Grid size={6}>
				<StyledButton
					disabled={props.disableStart}
					onClick={props.onStartClick}
				>
					Start
				</StyledButton>
			</Grid>
			<Grid size={6}>
				<StyledButton
					disabled={props.disableClear}
					onClick={props.onClearClick}
				>
					Clear
				</StyledButton>
			</Grid>
			<Grid size={6}>
				<StyledButton
					disabled={props.disableReview}
					onClick={props.onReviewClick}
				>
					Review
				</StyledButton>
			</Grid>
		</Grid>
	);
}

function HitLog({ timings }: { timings: number[] }) {
	return (
		<Box sx={{ p: 1 }}>
			<Typography variant="h5">Hit Log:</Typography>
			<Paper sx={{ m: 1 }}>
				<List>
					<TransitionGroup>
						{timings.toReversed().map((time, i) => (
							<Collapse key={i}>
								<ListItemButton>
									<ListItemAvatar>
										<Avatar>#{timings.length - i}</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={`Time: ${time.toFixed(2)}s`}
										secondary={`Split: ${(i > 0
											? timings[i] - timings[i - 1]
											: 0
										).toFixed(2)}s`}
									/>
								</ListItemButton>
							</Collapse>
						))}
					</TransitionGroup>
				</List>
			</Paper>
		</Box>
	);
}

export default function Timer() {
	const [displayTime, setDisplayTime] = useState(0);
	const [timings, setTimings] = useState<number[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [disableState, setDisableState] = useState({
		menu: false,
		start: false,
		clear: true,
		review: true,
	});
	const [recivedData, setRecivedData] = useState(false);

	const StyledGridItem = (props: GridProps) => {
		const { children, ...rest } = props;
		return (
			<Grid {...rest}>
				<Paper elevation={5} sx={{ p: 1, height: "100%" }}>
					{children}
				</Paper>
			</Grid>
		);
	};

	const OnHit = () => {
		if (!recivedData) return;
		const newTime = Date.now() / 10000;
		const newTimings = [...timings, newTime];
		setTimings(newTimings);
		setCurrentIndex(newTimings.length - 1);
		setDisplayTime(newTime);
	};

	const OnStart = () => {
		setDisableState({
			menu: true,
			start: true,
			clear: true,
			review: true,
		});
		// TODO: start timer
		setDisableState({
			menu: true,
			start: true,
			clear: true,
			review: false,
		});
		setRecivedData(true);
	};

	const OnClear = () => {
		setDisableState({
			menu: false,
			start: false,
			clear: true,
			review: true,
		});
		setTimings([]);
		setCurrentIndex(0);
		setDisplayTime(0);
	};

	const OnReview = () => {
		setDisableState({
			menu: false,
			start: false,
			clear: false,
			review: true,
		});
		setRecivedData(false);
	};

	const OnMenu = () => {};

	return (
		<>
			<button onClick={OnHit}>+</button>
			<Grid container spacing={2}>
				<StyledGridItem size={{ xs: 12, md: 6 }}>
					<TimeDisplay
						time={displayTime}
						split={
							timings.length > 0
								? timings[currentIndex] -
										timings[currentIndex - 1] ||
									timings[currentIndex]
								: 0
						}
						shot={timings.length > 0 ? currentIndex + 1 : 0}
						totalShots={timings.length}
					/>
				</StyledGridItem>
				<StyledGridItem size={{ xs: 12, md: 6 }}>
					<ButtonGroup
						disableClear={disableState.clear}
						disableMenu={disableState.menu}
						disableReview={disableState.review}
						disableStart={disableState.start}
						onClearClick={OnClear}
						onMenuClick={OnMenu}
						onReviewClick={OnReview}
						onStartClick={OnStart}
					/>
				</StyledGridItem>
				<StyledGridItem size={{ xs: 12 }}>
					<HitLog timings={timings} />
				</StyledGridItem>
			</Grid>
		</>
	);
}
