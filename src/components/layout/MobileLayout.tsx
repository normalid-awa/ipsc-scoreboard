import {
	Box,
	Collapse,
	Paper,
	Slide,
	SwipeableDrawer,
	Toolbar,
	useScrollTrigger,
} from "@mui/material";
import { LayoutProps } from "./Layout";
import { ReactElement, useEffect, useRef, useState } from "react";
import AppTopBar from "./AppTopBar";
import NavBar from "./NavBar";
import { UserCard } from "../UserCard";

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
	target: Node | null;
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
	const [scrollTarget, setScrollTarget] = useState<Node | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setScrollTarget(scrollRef.current);
	}, []);

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
						<UserCard sx={{ p: 2 }} key={1} />,
						<Box sx={{ my: 1 }} key={2} />,
					]}
				/>
			</SwipeableDrawer>
			<SlideOnScroll target={scrollTarget}>
				<div>
					<AppTopBar fold={props.fold} setFold={props.setFold} mobileLayout />
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
				<CollapseOnScroll target={scrollTarget}>
					<Toolbar />
				</CollapseOnScroll>
				<Paper
					sx={{ p: 1, pt: 2, height: "100vh", overflow: "auto" }}
					ref={scrollRef}
				>
					{props.children}
				</Paper>
			</div>
		</>
	);
}
