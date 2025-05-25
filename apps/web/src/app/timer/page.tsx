import { Paper } from "@mui/material";
import Timer from "@/components/timer/Timer";

export default function TimerPage() {
	return (
		<div>
			<Paper elevation={2} sx={{ p: 2 }}>
				<Timer />
			</Paper>
		</div>
	);
}
