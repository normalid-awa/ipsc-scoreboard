import { authClient } from "@/auth/auth.client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { confirm } from "material-ui-confirm";
import { FormEvent, useRef, useState } from "react";

export const Route = createFileRoute("/account/resetPassword")({
	component: RouteComponent,
});

function RouteComponent() {
	const [sendEmailCooldown, setSendEmailCooldown] = useState(0);
	const [sendEmailLoading, setSendEmailLoading] = useState(false);
	const emailEleRef = useRef<HTMLInputElement>(null);
	const navigate = Route.useNavigate();

	async function sendEmail() {
		if (!emailEleRef.current?.checkValidity()) {
			confirm({
				description: "Please enter a valid email address.",
				hideCancelButton: true,
			});
			return;
		}

		setSendEmailLoading(true);
		const { data, error } = await authClient.forgetPassword.emailOtp({
			email: emailEleRef.current!.value, // required
		});
		setSendEmailLoading(false);

		if (error) {
			confirm({
				description: error.message,
			});
			return;
		}

		let countdown = 60;
		setSendEmailCooldown(countdown);
		let countdownIntervalId = setInterval(() => {
			if (countdown <= 0) {
				clearInterval(countdownIntervalId);
			}
			countdown--;
			setSendEmailCooldown(countdown);
		}, 1000);
	}

	async function resetPassword(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		if (formData.get("password") !== formData.get("confirmPassword")) {
			confirm({
				title: "Error",
				description: "Passwords do not match.",
				hideCancelButton: true,
			});
			return;
		}

		const { data, error } = await authClient.emailOtp.resetPassword({
			email: formData.get("email") as string,
			otp: formData.get("verificationCode") as string,
			password: formData.get("password") as string,
		});

		if (error) {
			confirm({
				title: "Error",
				description: error.message,
				hideCancelButton: true,
			});
			return;
		}

		await authClient.signIn.email({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			rememberMe: true,
		});

		await confirm({
			title: "Success",
			description: "Password has been reset successfully.",
			hideCancelButton: true,
		});

		navigate({
			to: "/",
		});
	}

	return (
		<>
			<Container maxWidth="md" fixed sx={{ height: "100%" }}>
				<Stack
					component={"form"}
					spacing={2}
					justifyContent={"center"}
					sx={{ height: "50%" }}
					onSubmit={resetPassword}
				>
					<Typography variant="h3" textAlign={"center"}>
						Reset Password
					</Typography>
					<Stack direction={"row"} spacing={1}>
						<TextField
							sx={{ flexGrow: 1 }}
							type="email"
							label="Email"
							name="email"
							inputRef={emailEleRef}
							helperText={
								sendEmailCooldown > 0 &&
								"Verification code has been sent to your email. Please check your inbox."
							}
						/>
						<Button
							loading={sendEmailLoading}
							variant="contained"
							disabled={sendEmailCooldown > 0}
							onClick={sendEmail}
						>
							{sendEmailCooldown > 0
								? `Retry in ${sendEmailCooldown}s`
								: "Send Verification Code"}
						</Button>
					</Stack>
					<TextField
						type="text"
						label="Verification Code"
						name="verificationCode"
					/>
					<TextField type="password" label="Password" name="password" />
					<TextField
						type="password"
						label="Re-enter Password"
						name="confirmPassword"
					/>
					<Button type="submit" variant="contained" size="large">
						Reset Password
					</Button>
				</Stack>
			</Container>
		</>
	);
}
