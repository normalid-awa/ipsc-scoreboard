import {
	OscillatorTypeMap,
	TimerEvent,
	timerMap,
	TimerSetting,
	useTimer,
} from "@/providers/timer/TimerProvider";
import { useState } from "react";
import InputSlider from "../inputs/InputSlider";
import { beep } from "./Timer";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonGroup from "@mui/material/ButtonGroup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface GeneralSettingsProps {
	randomizeCountdownTime: boolean;
	countdownTime: number | number[];
	buzzerFrequency: number;
	buzzerDuration: number;
	buzzerWaveform: OscillatorType;
	setRandomizeCountdownTime: (value: boolean) => void;
	setCountdownTime: (value: number | number[]) => void;
	setBuzzerFrequency: (value: number) => void;
	setBuzzerDuration: (value: number) => void;
	setBuzzerWaveform: (value: OscillatorType) => void;
}

function GeneralSettings(props: GeneralSettingsProps) {
	return (
		<Stack divider={<Divider />} spacing={1}>
			<FormGroup>
				<FormControlLabel
					control={
						<Switch
							checked={props.randomizeCountdownTime}
							onChange={(e) =>
								props.setRandomizeCountdownTime(
									e.target.checked,
								)
							}
						/>
					}
					label="Countdown time randomize"
					labelPlacement="top"
				/>
			</FormGroup>
			<InputSlider
				label={`Countdown time${props.randomizeCountdownTime ? " range" : ""}`}
				unit="s"
				value={props.countdownTime}
				onChange={(value) => props.setCountdownTime(value)}
				min={0.1}
				max={10}
				step={0.1}
			/>
			<InputSlider
				label="Buzzer frequency"
				unit="Hz"
				value={props.buzzerFrequency}
				onChange={(value) => props.setBuzzerFrequency(value as number)}
				min={20}
				max={10000}
				step={1}
			/>
			<InputSlider
				label="Buzzer duration"
				unit="s"
				value={props.buzzerDuration}
				onChange={(value) => props.setBuzzerDuration(value as number)}
				min={0.1}
				max={5}
				step={0.1}
			/>
			<FormControl fullWidth>
				<InputLabel>Waveform</InputLabel>
				<Select label="Waveform" value={props.buzzerWaveform}>
					{OscillatorTypeMap.map((waveType) => (
						<MenuItem
							key={waveType}
							value={waveType}
							onClick={() => props.setBuzzerWaveform(waveType)}
						>
							{waveType}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Button
				onClick={() =>
					beep(
						props.buzzerFrequency,
						props.buzzerDuration,
						props.buzzerWaveform,
					)
				}
			>
				Test buzzer
			</Button>
		</Stack>
	);
}

export interface TimerMenuDialogProps {
	open: boolean;
	onClose: () => void;
}
export default function TimerMenuDialog(props: TimerMenuDialogProps) {
	const { isConnected, timer, setTimer } = useTimer();
	const [expanded, setExpanded] = useState<string | false>(false);
	const [selectedTimer, setSelectedTimer] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [settings, setSettings] = useState<TimerSetting>({
		buzzerDuration: 0,
		buzzerFrequency: 0,
		buzzerWaveform: "sine",
		countdownTime: 0,
		randomizeCountdownTime: false,
		randomCountdownTimeMax: 0,
		randomCountdownTimeMin: 0,
	});

	const expandPanel =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	const connect = async () => {
		if (!timerMap[selectedTimer]) return;
		const newTimer = new (await timerMap[selectedTimer]())();
		setTimer(newTimer);
		newTimer.connect();
		setLoading(true);
		addEventListener(TimerEvent.Connect, async () => {
			setLoading(false);
			setSettings(await newTimer.getSetting());
		});
		addEventListener(TimerEvent.Disconnect, () => {
			setLoading(false);
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const setSettingByKey = (key: keyof TimerSetting) => (value: any) => {
		setSettings({ ...settings, [key]: value });
	};

	const disconnect = () => {
		timer?.disconnect();
	};

	const ident = () => {
		timer?.ident();
	};

	const saveSetting = async () => {
		await timer?.setSetting(settings);
	};

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			open={props.open}
			onClose={props.onClose}
			scroll={"paper"}
		>
			<DialogTitle>Timer Menu</DialogTitle>
			<DialogContent dividers>
				<Modal
					open={loading}
					sx={{ justifySelf: "center", alignSelf: "center" }}
				>
					<CircularProgress />
				</Modal>
				<Stack spacing={1}>
					<FormControl fullWidth>
						<InputLabel>Timer</InputLabel>
						<Select
							value={selectedTimer}
							onChange={(e) => setSelectedTimer(e.target.value)}
							label="Timer"
							disabled={isConnected}
						>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{Object.keys(timerMap).map((timer) => (
								<MenuItem key={timer} value={timer}>
									{timer}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<ButtonGroup fullWidth variant="contained">
						<Button disabled={isConnected} onClick={connect}>
							Connect
						</Button>
						<Button disabled={!isConnected} onClick={disconnect}>
							Disconnect
						</Button>
					</ButtonGroup>
					<Collapse in={isConnected} unmountOnExit mountOnEnter>
						<Stack spacing={1}>
							<Button
								onClick={ident}
								fullWidth
								variant="outlined"
								color="secondary"
							>
								Ident
							</Button>
							<Button
								variant="contained"
								fullWidth
								onClick={saveSetting}
							>
								Save setting
							</Button>
							<Accordion
								expanded={expanded === "general"}
								onChange={expandPanel("general")}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
								>
									<Typography component="span">
										General settings
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<GeneralSettings
										buzzerDuration={settings.buzzerDuration}
										buzzerFrequency={
											settings.buzzerFrequency
										}
										buzzerWaveform={settings.buzzerWaveform}
										countdownTime={
											settings.randomizeCountdownTime
												? [
														settings.randomCountdownTimeMin,
														settings.randomCountdownTimeMax,
													]
												: settings.countdownTime
										}
										randomizeCountdownTime={
											settings.randomizeCountdownTime
										}
										setBuzzerDuration={setSettingByKey(
											"buzzerDuration",
										)}
										setBuzzerFrequency={setSettingByKey(
											"buzzerFrequency",
										)}
										setBuzzerWaveform={setSettingByKey(
											"buzzerWaveform",
										)}
										setCountdownTime={(value) => {
											if (Array.isArray(value)) {
												setSettingByKey(
													"randomCountdownTimeMin",
												)(value[0]);
												setSettingByKey(
													"randomCountdownTimeMax",
												)(value[1]);
											} else {
												setSettingByKey(
													"countdownTime",
												)(value);
											}
										}}
										setRandomizeCountdownTime={setSettingByKey(
											"randomizeCountdownTime",
										)}
									/>
								</AccordionDetails>
							</Accordion>
							<Accordion
								expanded={expanded === "timer"}
								onChange={expandPanel("timer")}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
								>
									<Typography component="span">
										Timer specific settings
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									{timer?.renderSettingWidget({
										settingData: settings,
										setSettingData: (v) =>
											setSettings({ ...settings, ...v }),
									})}
								</AccordionDetails>
							</Accordion>
						</Stack>
					</Collapse>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
