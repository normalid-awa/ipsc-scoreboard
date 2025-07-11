import { Paper } from "@mui/material";
import Timer from "@/components/timer/Timer";

export default function TimerPage() {
	return (
		<Paper elevation={2} sx={{ p: 2, height: "100%" }}>
			<Timer />
		</Paper>
	);
}
