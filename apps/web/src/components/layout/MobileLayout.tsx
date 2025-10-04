import { LayoutProps } from "./Layout";
import { ReactElement, useEffect, useRef, useState } from "react";
import AppTopBar from "./AppTopBar";
import NavBar from "./NavBar";
import { UserCard } from "../UserCard";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Collapse from "@mui/material/Collapse";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ScrollTargetProvider } from "./LayoutViewScrollTargetProvider";

function SlideOnScroll({
	children,
	target,
}: {
	children: ReactElement;
	target: Node | null;
}) {
	const trigger = useScrollTrigger({
		target: target,
	});

	return (
		<Slide
			style={{
				padding: 0,
				margin: 0,
			}}
			appear={false}
			direction="down"
			in={!trigger}
		>
			{children}
		</Slide>
	);
}

function CollapseOnScroll({
	children,
	target,
}: {
	children: ReactElement;
	target: Element | null;
}) {
	const trigger = useScrollTrigger({
		target: target,
	});

	return (
		<Collapse
			style={{ padding: 0, margin: 0 }}
			appear={false}
			orientation="vertical"
			in={!trigger}
		>
			{children}
		</Collapse>
	);
}

export default function MobileLayout(props: LayoutProps) {
	const scrollRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<SwipeableDrawer
				open={props.fold}
				onClose={() => props.setFold(false)}
				onOpen={() => props.setFold(true)}
				sx={{ width: 200 }}
			>
				<Toolbar />
				<NavBar
					topItems={[
						<Box sx={{ flexGrow: 1 }}>
							<UserCard sx={{ p: 2 }} />
						</Box>,
						<Box sx={{ my: 1 }} />,
					]}
				/>
			</SwipeableDrawer>
			<SlideOnScroll target={scrollRef.current}>
				<div>
					<AppTopBar
						fold={props.fold}
						setFold={props.setFold}
						mobileLayout
					/>
				</div>
			</SlideOnScroll>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "absolute",
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
				}}
			>
				<CollapseOnScroll target={scrollRef.current}>
					<Toolbar />
				</CollapseOnScroll>
				<Paper
					sx={{ p: 1, pt: 2, height: "100vh", overflow: "auto" }}
					ref={scrollRef}
				>
					<ScrollTargetProvider ref={scrollRef.current}>
						{props.children}
					</ScrollTargetProvider>
				</Paper>
			</div>
		</>
	);
}
