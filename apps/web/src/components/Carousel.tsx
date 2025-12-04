import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack, { StackProps } from "@mui/material/Stack";
import { Children, useCallback, useRef } from "react";

export interface CarouselProps extends StackProps {
	hideButtons?: true;
}

export function Carousel(props: CarouselProps) {
	const { children, ...stackProps } = props;
	const stackRef = useRef<HTMLDivElement>(null);
	const isHorizontal =
		stackProps.direction == "row" || stackProps.direction == "row-reverse";

	const scrollToPrevious = useCallback(() => {
		if (!stackRef.current) return;
		stackRef.current.scrollBy({
			left: -1,
			behavior: "smooth",
		});
	}, [stackRef]);

	const scrollToNext = useCallback(() => {
		if (!stackRef.current) return;
		stackRef.current.scrollBy({
			left: 1,
			behavior: "smooth",
		});
	}, [stackRef]);

	return (
		<Box
			sx={{
				position: "relative",
			}}
		>
			<Stack
				ref={stackRef}
				style={{
					scrollSnapType: isHorizontal
						? "x mandatory"
						: "y mandatory",
					overflowX: isHorizontal ? "auto" : "unset",
					overflowY: !isHorizontal ? "auto" : "unset",
				}}
				alignItems={"center"}
				{...stackProps}
			>
				{Children.map(children, (child) => (
					<Box
						sx={{
							textAlign: "center",
							scrollSnapAlign: "center",
							flex: "none",
							width: "100%",
							height: !isHorizontal ? "100%" : "min-content",
							aspectRatio: "auto",
							display: "flex",
							justifyContent: "center",
						}}
					>
						{child}
					</Box>
				))}
			</Stack>
			{props.hideButtons ? (
				<> </>
			) : (
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						right: 10,
						left: 10,
						display: "flex",
						flexDirection: props.direction,
						justifyContent: "space-between",
						pointerEvents: "none",
					}}
				>
					<IconButton
						sx={{
							backdropFilter: "blur(4px) invert(0.2)",
							userSelect: "none",
							pointerEvents: "all",
						}}
						onClick={scrollToPrevious}
					>
						<ArrowLeftIcon />
					</IconButton>
					<IconButton
						sx={{
							backdropFilter: "blur(4px) invert(0.2)",
							userSelect: "none",
							pointerEvents: "all",
						}}
						onClick={scrollToNext}
					>
						<ArrowRightIcon />
					</IconButton>
				</Box>
			)}
		</Box>
	);
}
