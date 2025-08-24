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

export const authClient = createAuthClient({
	plugins: [
		usernameClient(),
		emailOTPClient(),
		multiSessionClient(),
		organizationClient(),
	],
});
export const { signIn, signUp, useSession } = authClient;

export function AuthProtectedComponent(props: { component: ReactElement }) {
	const session = useSession();
	if (session.isPending) {
		return <Skeleton width={"100%"} height={"100%"} />;
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
