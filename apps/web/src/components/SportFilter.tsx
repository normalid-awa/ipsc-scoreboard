import Chip from "@mui/material/Chip";
import DoneIcon from "@mui/icons-material/Done";
import { SportEnum } from "@ipsc_scoreboard/api";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

function SportFilterChip(props: {
	onEnable: () => void;
	onDisable: () => void;
	enabled: boolean;
	label: string;
	size?: "small" | "medium";
}) {
	return (
		<Chip
			size={props.size || "medium"}
			label={props.label}
			variant={props.enabled ? "filled" : "outlined"}
			color={props.enabled ? "primary" : "default"}
			clickable
			onClick={props.enabled ? props.onDisable : props.onEnable}
			onDelete={props.enabled ? props.onDisable : undefined}
			deleteIcon={props.enabled ? <DoneIcon /> : undefined}
		/>
	);
}

export function SportFilter(props: {
	filters: SportEnum[];
	setFilters: (filters: SportEnum[]) => void;
}) {
	const theme = useTheme();
	const smallVariant = useMediaQuery(theme.breakpoints.down("sm"));

	function removeFilter(filter: SportEnum) {
		const newFilters = props.filters.filter(
			(v) => v !== filter,
		) as SportEnum[];
		props.setFilters(newFilters);
	}

	function addFilter(filter: SportEnum) {
		if (!props.filters.includes(filter)) {
			props.setFilters([...props.filters, filter] as SportEnum[]);
		}
	}

	return (
		<Stack
			direction={"row"}
			spacing={smallVariant ? 0.5 : 1}
			gap={smallVariant ? 0.5 : 1}
			flexWrap={"wrap"}
		>
			{Object.values(SportEnum).map((v) => (
				<SportFilterChip
					size={smallVariant ? "small" : "medium"}
					key={v}
					label={v}
					onEnable={() => addFilter(v)}
					onDisable={() => removeFilter(v)}
					enabled={props.filters.includes(v)}
				/>
			))}
		</Stack>
	);
}
