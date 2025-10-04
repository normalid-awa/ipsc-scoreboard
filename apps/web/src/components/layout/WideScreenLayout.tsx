import { LayoutProps } from "./Layout";
import AppTopBar from "./AppTopBar";
import NavBar from "./NavBar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { useRef } from "react";
import { ScrollTargetProvider } from "./LayoutViewScrollTargetProvider";

export default function WideScreenLayout(props: LayoutProps) {
	const scrollTarget = useRef(null);

	return (
		<>
			<Paper>
				<AppTopBar fold={props.fold} setFold={props.setFold} />
				<Box sx={{ display: "flex" }}>
					<Collapse
						in={props.fold}
						orientation="horizontal"
						collapsedSize={70}
					>
						<Toolbar />
						<Divider sx={{ mb: 1 }} />
						<NavBar />
					</Collapse>
					<Paper
						variant="outlined"
						sx={{
							flexGrow: 1,
							width: 0,
							p: 1,
							height: "100vh",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Toolbar sx={{ m: 0 }} />
						<Paper
							variant="outlined"
							sx={{
								flexGrow: 1,
								p: 2,
								overflow: "auto",
								maxWidth: "100%",
							}}
							ref={scrollTarget}
						>
							<ScrollTargetProvider ref={scrollTarget.current}>
								{props.children}
							</ScrollTargetProvider>
						</Paper>
					</Paper>
				</Box>
			</Paper>
		</>
	);
}
