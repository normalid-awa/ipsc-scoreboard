import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import AppTopBar from "./AppTopBar";
import { LayoutProps } from "./Layout";
import { ScrollTargetProvider } from "./LayoutViewScrollTargetProvider";
import NavBar from "./NavBar";

export default function WideScreenLayout(props: LayoutProps) {
	return (
		<Paper>
			<AppTopBar fold={props.fold} setFold={props.setFold} />
			<Collapse
				in={props.fold}
				orientation="horizontal"
				collapsedSize={70}
				sx={{
					float: "left",
					position: "sticky",
					top: 0,
					bottom: 0,
					maxHeight: "100vh",
					overflow: "hidden",
				}}
			>
				<Toolbar />
				<Divider sx={{ mb: 1 }} />
				<NavBar />
			</Collapse>
			<Paper
				variant="outlined"
				sx={{
					flexGrow: 1,
					p: 1,
					maxWidth: "100%",
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Toolbar sx={{ m: 0 }} />
				<Paper
					variant="outlined"
					sx={{
						flexGrow: 1,
						p: 2,
						maxWidth: "100%",
					}}
				>
					<ScrollTargetProvider>
						{props.children}
					</ScrollTargetProvider>
				</Paper>
			</Paper>
		</Paper>
	);
}
