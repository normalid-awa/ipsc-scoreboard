import { useSession } from "@/auth.client";
import {
	Avatar,
	Card,
	CardActionArea,
	CardActionAreaProps,
	Grid,
	Paper,
	Skeleton,
	Typography,
} from "@mui/material";

export function UserCard(props: CardActionAreaProps) {
	const { data, isPending } = useSession();

	if (isPending) {
		<Skeleton variant="rectangular" />;
	}

	return (
		<Card elevation={5} variant="outlined">
			<CardActionArea {...props}>
				<Grid container gap={2} alignItems={"center"}>
					<Grid size={"auto"}>
						<Avatar
							sx={{ boxShadow: (theme) => `${theme.shadows[5]}` }}
							src={data?.user.image || data?.user.name}
						/>
					</Grid>
					<Grid size={"grow"}>
						<Typography variant="h6">{data?.user.name}</Typography>
					</Grid>
				</Grid>
			</CardActionArea>
		</Card>
	);
}
