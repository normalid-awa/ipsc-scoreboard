"use client";

import { useCallback, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import TimerMenuDialog from "./Menu";
import {
	HitEvent,
	TimerEvent,
	useTimer,
} from "@/providers/timer/TimerProvider";
import Grid, { GridProps } from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";

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
				<List disablePadding>
					<TransitionGroup>
						{reversedTimings.length === 0 ? (
							<Paper variant="outlined" sx={{ p: 2 }}>
								<Typography textAlign={"center"}>
									No record
								</Typography>
							</Paper>
						) : (
							<></>
						)}
						{reversedTimings.map((time, i) => (
							<Collapse key={i}>
								<Paper variant="outlined">
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
								</Paper>
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
			<Paper elevation={2} sx={{ p: 1, height: "100%" }}>
				{children}
			</Paper>
		</Grid>
	);
};

const breakSignal = Symbol("break");
const countdownBreakEvent = new CustomEvent(breakSignal.toString());

class Buzzer {
	private static instance: Buzzer | null = null;

	private context: AudioContext;

	private constructor() {
		this.context = new AudioContext();
	}

	public static getInstance(): Buzzer {
		if (Buzzer.instance === null) {
			Buzzer.instance = new Buzzer();
		}
		return Buzzer.instance;
	}

	public beep(
		frequency: number,
		durationInS: number,
		waveform: OscillatorType,
	): void {
		const oscillator = this.context.createOscillator();
		oscillator.connect(this.context.destination);
		navigator.vibrate(durationInS * 1000);
		oscillator.type = waveform;
		oscillator.frequency.value = frequency;
		oscillator.start();
		setTimeout(() => {
			oscillator.stop();
		}, durationInS * 1000);
	}
}

export function beep(
	frequency: number,
	durationInS: number,
	waveform: OscillatorType,
) {
	Buzzer.getInstance().beep(frequency, durationInS, waveform);
}

export default function Timer() {
	const { isConnected, timer } = useTimer();
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
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		addEventListener(TimerEvent.Hit, OnHit);
		return () => {
			removeEventListener(TimerEvent.Hit, OnHit);
		};
	});

	const OnHit = useCallback(
		(e: HitEvent) => {
			if (!recivedData) return;
			const newTime = e.detail ?? 0;
			const newTimings = [...timings, newTime];
			setTimings(newTimings);
			setCurrentIndex(newTimings.length - 1);
			setDisplayTime(newTime);
		},
		[timings, recivedData],
	);

	const OnStart = async () => {
		if (!timer) return;
		setDisableState({
			menu: true,
			start: true,
			clear: true,
			review: true,
			break: false,
		});
		const setting = await timer.getSetting();
		const duration = setting.buzzerDuration;
		const frequency = setting.buzzerFrequency;
		const waveform = setting.buzzerWaveform;
		let countdownTime;
		if (setting.randomizeCountdownTime) {
			const min = setting.randomCountdownTimeMin;
			const max = setting.randomCountdownTimeMax;
			countdownTime = Math.random() * (max - min) + min;
		} else {
			countdownTime = setting.countdownTime;
		}

		const startTime = Date.now();
		let countdownBreak = false;
		const intervalId = setInterval(() => {
			setDisplayTime(countdownTime - (Date.now() - startTime) / 1000);
		}, 1);

		function breakHandler() {
			countdownBreak = true;
			clearInterval(intervalId);
			setDisableState({
				menu: false,
				start: false,
				clear: true,
				review: true,
				break: true,
			});
		}

		addEventListener(breakSignal.toString(), breakHandler);
		await new Promise((resolve) =>
			setTimeout(resolve, countdownTime * 1000),
		);
		removeEventListener(breakSignal.toString(), breakHandler);
		if (countdownBreak) return;

		beep(frequency, duration, waveform);
		timer.start();
		setRecivedData(true);

		clearInterval(intervalId);
		setDisplayTime(0);
		setDisableState({
			menu: true,
			start: true,
			clear: true,
			review: false,
			break: true,
		});
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
		timer?.review();
	};

	//TODO: Implement menu
	const OnMenu = () => {
		setMenuOpen(true);
	};

	const OnBreak = () => {
		dispatchEvent(countdownBreakEvent);
	};

	return (
		<>
			<TimerMenuDialog
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
			/>
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
					{isConnected ? (
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
					) : (
						<Button
							variant="contained"
							size="large"
							fullWidth
							sx={{ height: "100%" }}
							onClick={OnMenu}
						>
							Menu
						</Button>
					)}
				</StyledGridItem>
				<StyledGridItem size={{ xs: 12 }}>
					<HitLog timings={timings} />
				</StyledGridItem>
			</Grid>
		</>
	);
}
