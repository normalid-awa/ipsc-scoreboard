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
			<Grid size={12} textAlign="center" alignContent={"center"}>
				<Typography sx={{ fontWeight: 500 }} variant="h1">
					{props.time.toFixed(2)}
				</Typography>
			</Grid>
			<Grid size={6} textAlign="center" alignContent={"center"}>
				<Typography variant="overline">
					Split: {props.split.toFixed(2)}s
				</Typography>
			</Grid>
			<Grid size={6} textAlign="center" alignContent={"center"}>
				<Typography variant="overline">
					Shot: #{props.shot} / {props.totalShots}
				</Typography>
			</Grid>
		</Grid>
	);
}

const StyledButton = (props: ButtonProps) => (
	<Button
		fullWidth
		size="large"
		sx={{ height: 80 }}
		variant="outlined"
		{...props}
	/>
);
interface ButtonGroupProps {
	disableMenu: boolean;
	disableStart: boolean;
	disableClear: boolean;
	disableReview: boolean;
	disableBreak: boolean;
	onMenuClick: () => void;
	onStartClick: () => void;
	onClearClick: () => void;
	onReviewClick: () => void;
	onBreakClick: () => void;
}
function ButtonGroup(props: ButtonGroupProps) {
	return (
		<>
			<Collapse in={!props.disableBreak} mountOnEnter>
				<Button
					fullWidth
					size="large"
					sx={{ height: 80 }}
					variant="contained"
					color="warning"
					onClick={props.onBreakClick}
				>
					Break
				</Button>
			</Collapse>
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
		</>
	);
}

function HitLog({ timings }: { timings: number[] }) {
	const reversedTimings = timings.toReversed();
	return (
		<Box sx={{ p: 1 }}>
			<Typography variant="h5">Hit Log:</Typography>
			<Paper sx={{ m: 1 }}>
				<List>
					<TransitionGroup>
						{reversedTimings.map((time, i) => (
							<Collapse key={i}>
								<ListItemButton>
									<ListItemAvatar>
										<Avatar>#{i + 1}</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={`Time: ${time.toFixed(2)}s`}
										secondary={`Split: ${(i ==
										reversedTimings.length - 1
											? 0
											: reversedTimings[i] -
												reversedTimings[i + 1]
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

const breakSignal = Symbol("break");
const countdownBreakEvent = new CustomEvent(breakSignal.toString());

export default function Timer() {
	const [displayTime, setDisplayTime] = useState(0);
	const [timings, setTimings] = useState<number[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [disableState, setDisableState] = useState({
		menu: false,
		start: false,
		clear: true,
		review: true,
		break: true,
	});
	const [recivedData, setRecivedData] = useState(false);

	const OnHit = () => {
		if (!recivedData) return;
		const newTime = Date.now() / 10000;
		const newTimings = [...timings, newTime];
		setTimings(newTimings);
		setCurrentIndex(newTimings.length - 1);
		setDisplayTime(newTime);
	};

	const OnStart = async () => {
		setDisableState({
			menu: true,
			start: true,
			clear: true,
			review: true,
			break: false,
		});
		const duration = 1000;
		const frequency = 1024;
		const waveform = "sine";
		const min = 1;
		const max = 4;
		let countdownBreak = false;
		const randomTime = Math.random() * (max - min) + min;
		const startTime = Date.now();
		const intervalId = setInterval(() => {
			setDisplayTime(randomTime - (Date.now() - startTime) / 1000);
		}, 1);

		addEventListener(breakSignal.toString(), () => {
			countdownBreak = true;
			clearInterval(intervalId);
			setDisableState({
				menu: false,
				start: false,
				clear: true,
				review: true,
				break: true,
			});
		});

		await new Promise((resolve) => setTimeout(resolve, randomTime * 1000));
		if (countdownBreak) return;

		navigator.vibrate(duration);
		const context = new AudioContext();
		const oscillator = context.createOscillator();
		oscillator.type = waveform;
		oscillator.frequency.value = frequency;
		oscillator.connect(context.destination);
		oscillator.start();
		setTimeout(function () {
			oscillator.stop();
		}, duration);

		clearInterval(intervalId);
		setDisplayTime(0);
		setDisableState({
			menu: true,
			start: true,
			clear: true,
			review: false,
			break: true,
		});
		setRecivedData(true);
	};

	const OnClear = () => {
		setDisableState({
			menu: false,
			start: false,
			clear: true,
			review: true,
			break: true,
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
			break: true,
		});
		setRecivedData(false);
	};

	//TODO: Implement menu
	const OnMenu = () => {};

	const OnBreak = () => {
		dispatchEvent(countdownBreakEvent);
	};

	return (
		<>
			<button onClick={OnHit}>+</button>
			<Grid container spacing={2}>
				<StyledGridItem size={{ xs: 12, md: 6 }}>
					<TimeDisplay
						time={displayTime}
						split={
							currentIndex > 0
								? timings[currentIndex] -
									timings[currentIndex - 1]
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
						disableBreak={disableState.break}
						onClearClick={OnClear}
						onMenuClick={OnMenu}
						onReviewClick={OnReview}
						onStartClick={OnStart}
						onBreakClick={OnBreak}
					/>
				</StyledGridItem>
				<StyledGridItem size={{ xs: 12 }}>
					<HitLog timings={timings} />
				</StyledGridItem>
			</Grid>
		</>
	);
}
