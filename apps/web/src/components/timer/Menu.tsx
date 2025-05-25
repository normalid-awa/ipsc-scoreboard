import {
	TimerEvent,
	timerMap,
	useTimer,
} from "@/providers/timer/TimerProvider";
import { ExpandMore } from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	ButtonGroup,
	CircularProgress,
	Collapse,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { useState } from "react";

export interface TimerMenuDialogProps {
	open: boolean;
	onClose: () => void;
}
export default function TimerMenuDialog(props: TimerMenuDialogProps) {
	const { isConnected, timer, setTimer } = useTimer();
	const [expanded, setExpanded] = useState<string | false>(false);
	const [selectedTimer, setSelectedTimer] = useState<string>("");
	const [loading, setLoading] = useState(false);

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
		addEventListener(TimerEvent.Connect, () => {
			setLoading(false);
		});
		addEventListener(TimerEvent.Disconnect, () => {
			setLoading(false);
		});
	};

	const disconnect = () => {
		timer?.disconnect();
	};

	const ident = () => {
		timer?.ident();
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
						<Button
							onClick={ident}
							fullWidth
							variant="outlined"
							color="secondary"
						>
							Ident
						</Button>
						<Accordion
							expanded={expanded === "general"}
							onChange={expandPanel("general")}
						>
							<AccordionSummary expandIcon={<ExpandMore />}>
								<Typography component="span">
									General settings
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Suspendisse malesuada lacus ex,
								sit amet blandit leo lobortis eget.
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "timer"}
							onChange={expandPanel("timer")}
						>
							<AccordionSummary expandIcon={<ExpandMore />}>
								<Typography component="span">
									Timer specific settings
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								{timer?.renderSettingWidget()}
							</AccordionDetails>
						</Accordion>
					</Collapse>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
