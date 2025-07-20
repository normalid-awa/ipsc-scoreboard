import { Card, Chip, Container, Stack, Typography } from "@mui/material";
import { createAuthClient } from "better-auth/react";
import LoginForm from "./components/LoginForm";
import { ReactElement } from "react";

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	// baseURL: "http://localhost:3000",
});
export const { signIn, signUp, useSession } = authClient;

export function AuthProtectedComponent(props: { component: ReactElement }) {
	const session = useSession();
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
