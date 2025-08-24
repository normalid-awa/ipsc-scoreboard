import { authClient, useSession } from "@/auth/auth.client";
import env from "@/env";
import { FileRouteTypes } from "@/routeTree.gen";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { FormEvent } from "react";

export const Route = createFileRoute("/newUser")({
	component: RouteComponent,
	validateSearch: (s) => {
		return {
			from: (s.from || "/") as FileRouteTypes["to"],
		};
	},
	head: () => ({
		meta: [{ title: `${env.VITE_TITLE_PREFIX} Create Account` }],
	}),
});

function RouteComponent() {
	const { data, isPending } = useSession();
	const from = Route.useSearch({ select: (s) => s.from });
	const navigate = Route.useNavigate();

	if (isPending) {
		<Skeleton width={400} height={"100%"} />;
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const displayName = formData.get("displayName") as string;
		await authClient.updateUser({
			name: displayName,
		});
		navigate({
			to: from,
		});
	}

	return (
		<>
			<Container maxWidth="sm" sx={{ height: "100%" }}>
				<Stack
					sx={{ height: "75%" }}
					justifyContent={"center"}
					spacing={2}
					component={"form"}
					onSubmit={handleSubmit}
				>
					<Typography textAlign={"center"} variant="h4">
						Your account has been created!
					</Typography>
					<Typography textAlign={"center"} variant="overline">
						Fill in the following details to complete your
						registration
					</Typography>
					<TextField
						autoFocus
						label="Display Name"
						defaultValue={data?.user.name}
						name="displayName"
						type="text"
						variant="outlined"
						fullWidth
						required
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="large"
					>
						Complete
					</Button>
				</Stack>
			</Container>
		</>
	);
}
