import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ConstructionIcon from "@mui/icons-material/Construction";

export function FeaturePlaceHolder(props: { name: string }) {
	return (
		<Paper
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				overflow: "auto",
			}}
		>
			<ConstructionIcon sx={{ fontSize: 100 }} />
			<Typography variant="h4">{props.name}</Typography>
			<Typography variant="h6">
				This feature will be available very soon !
			</Typography>
		</Paper>
	);
}
