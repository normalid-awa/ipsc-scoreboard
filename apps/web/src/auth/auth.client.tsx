import { createAuthClient } from "better-auth/react";
import LoginForm from "../components/LoginForm";
import { ReactElement } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import {
	emailOTPClient,
	usernameClient,
	organizationClient,
	multiSessionClient,
} from "better-auth/client/plugins";
import env from "@/env";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const authClient = createAuthClient({
	baseURL: env.VITE_BACKEND_API_URL,
	plugins: [usernameClient(), emailOTPClient(), multiSessionClient()],
});
export const { signIn, signUp, useSession } = authClient;

export function AuthProtectedComponent(props: { component: ReactElement }) {
	const session = useSession();
	if (session.isPending) {
		return (
			<div
				style={{
					height: "80vh",
					width: "80vw",
					position: "relative",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<Skeleton width="100%" height="100%" />
				<div
					style={{
						position: "relative",
						top: "-50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						display: "flex",
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CircularProgress color="secondary" thickness={5} />
					<Typography
						variant="h5"
						textAlign="right"
						color="textSecondary"
						sx={{ mx: 2 }}
					>
						Authanticating
					</Typography>
				</div>
			</div>
		);
	}

	if (!session.data)
		return (
			<Stack
				sx={{ height: "100%" }}
				spacing={5}
				alignItems="center"
				justifyContent="center"
			>
				<Typography variant="button" textAlign="center" color="warning">
					This page is protected, please log in.
				</Typography>
				<Container fixed maxWidth="sm">
					<Card sx={{ p: 2 }} variant="outlined">
						<LoginForm />
					</Card>
				</Container>
			</Stack>
		);
	return props.component;
}
