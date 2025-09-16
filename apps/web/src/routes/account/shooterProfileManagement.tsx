import { AuthProtectedComponent } from "@/auth/auth.client";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Sport } from "@ipsc_scoreboard/api";
import {
	useCreateShooterProfile,
	useDeleteShooterProfile,
	useMutateShooterProfile,
	useSelfShooterProfiles,
} from "@/queries/shooterProfile/shooterProfile";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { useConfirm } from "material-ui-confirm";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import ImageCropper from "@/components/ImageCropper";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export const Route = createFileRoute("/account/shooterProfileManagement")({
	component: () => <AuthProtectedComponent component={<RouteComponent />} />,
});

function ShooterCard(props: {
	id: number;
	sport: string;
	identifier: string;
	image?: string;
}) {
	const confirm = useConfirm();

	const [editMode, setEditMode] = useState(false);
	const [icon, setIcon] = useState<
		| {
				src: string;
				filename: string;
				mimetype: string;
		  }
		| undefined
	>();
	const [imageCropperOpen, setImageCropperOpen] = useState(false);

	const { mutate } = useMutateShooterProfile();
	const { mutate: deleteShooterProfile } = useDeleteShooterProfile();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (editMode) {
			const formData = new FormData(event.target as HTMLFormElement);
			const sport = formData.get("sport") as Sport;
			const identifier = formData.get("identifier") as string;
			if (
				sport == props.sport &&
				identifier == props.identifier &&
				icon == undefined
			) {
				setEditMode(false);
				return;
			}

			let file: File | undefined = undefined;
			if (icon)
				file = await fetch(icon.src)
					.then((res) => res.blob())
					.then((blob) => {
						return new File([blob], icon.filename, {
							type: icon.mimetype,
						});
					});

			mutate(
				{ id: props.id, sport, identifier, image: file },
				{
					onError() {
						setEditMode(true);
					},
				},
			);
		}
		setEditMode(!editMode);
	};

	const onDelete = async () => {
		if (
			(
				await confirm({
					title: "Confirm deletion",
					description:
						"It's not recommended to delete shooter profiles. You will lost ALL OF YOUR SCORE DATA. Are you sure you want to delete this shooter profile?",
				})
			).confirmed
		) {
			deleteShooterProfile(props.id);
		}
	};

	return (
		<ListItem component={"form"} onSubmit={handleSubmit}>
			{editMode ? (
				<>
					<ImageCropper
						open={imageCropperOpen}
						onClose={() => setImageCropperOpen(false)}
						aspectRatio={1}
						imageSrc={icon?.src || ""}
						onChange={(newIcon) =>
							setIcon({ ...icon!, src: newIcon })
						}
					/>
					<Grid container spacing={2} sx={{ width: "100%" }}>
						<Grid
							size={{ xs: 12, sm: 6, md: 4 }}
							alignContent={"center"}
							justifyItems={"left"}
						>
							<Button
								component="label"
								fullWidth
								startIcon={
									<Avatar
										src={
											icon
												? icon.src
												: `/api/image/${props.image}`
										}
									/>
								}
								variant="outlined"
								size="large"
							>
								Upload Image
								<VisuallyHiddenInput
									type="file"
									name="image"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.item(0);
										if (!file) {
											setIcon(undefined);
											return;
										}
										const reader = new FileReader();
										reader.readAsDataURL(file);
										reader.onload = () => {
											setIcon({
												src: reader.result as string,
												filename: file.name,
												mimetype: file.type,
											});
											setImageCropperOpen(true);
										};
									}}
								/>
							</Button>
						</Grid>
						<Grid size={{ xs: 12, sm: 6, md: 4 }}>
							<FormControl fullWidth required>
								<InputLabel>Sport</InputLabel>
								<Select
									label="Sport"
									name="sport"
									defaultValue={props.sport}
								>
									{Object.values(Sport).map((sport) => (
										<MenuItem key={sport} value={sport}>
											{sport}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, md: 4 }}>
							<TextField
								required
								fullWidth
								label="Identifier"
								name="identifier"
								defaultValue={props.identifier}
							/>
						</Grid>
					</Grid>
				</>
			) : (
				<>
					<ListItemAvatar>
						<Avatar
							sx={{ width: 65, height: 65, m: 1, mr: 2 }}
							src={`/api/image/${props.image}`}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Typography variant="h6">
								{props.identifier}
							</Typography>
						}
						secondary={
							<Typography variant="body2">
								{props.sport}
							</Typography>
						}
					/>
				</>
			)}
			<ListItemIcon>
				<IconButton type="submit">
					{editMode ? <DoneIcon color="success" /> : <EditIcon />}
				</IconButton>
				<IconButton color="error" onClick={onDelete}>
					<DeleteIcon />
				</IconButton>
			</ListItemIcon>
		</ListItem>
	);
}

function AddShooterForm(props: { onCreate?: () => void }) {
	const { mutate: create } = useCreateShooterProfile();
	const [icon, setIcon] = useState<
		| {
				src: string;
				filename: string;
				mimetype: string;
		  }
		| undefined
	>();
	const [imageCropperOpen, setImageCropperOpen] = useState(false);

	return (
		<Paper
			sx={{ p: 2, mt: 1 }}
			component="form"
			onSubmit={async (e) => {
				e.preventDefault();
				const formData = new FormData(e.target as HTMLFormElement);
				const sport = formData.get("sport") as Sport;
				const identifier = formData.get("identifier") as string;

				let file: File | undefined = undefined;
				if (icon)
					file = await fetch(icon.src)
						.then((res) => res.blob())
						.then((blob) => {
							return new File([blob], icon.filename, {
								type: icon.mimetype,
							});
						});

				create(
					{ sport, identifier, image: file },
					{
						onSuccess() {
							props.onCreate?.();
						},
					},
				);
			}}
		>
			<ImageCropper
				open={imageCropperOpen}
				onClose={() => setImageCropperOpen(false)}
				aspectRatio={1}
				imageSrc={icon?.src || ""}
				onChange={(newIcon) => setIcon({ ...icon!, src: newIcon })}
			/>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<Button
						component="label"
						fullWidth
						startIcon={<Avatar src={icon?.src || ""} />}
						variant="outlined"
						size="large"
					>
						Upload Image
						<VisuallyHiddenInput
							type="file"
							name="image"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.item(0);
								if (!file) {
									setIcon(undefined);
									return;
								}
								const reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = () => {
									setIcon({
										src: reader.result as string,
										filename: file.name,
										mimetype: file.type,
									});
									setImageCropperOpen(true);
								};
							}}
						/>
					</Button>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 8 }}>
					<FormControl fullWidth required>
						<InputLabel>Sport</InputLabel>
						<Select label="Sport" name="sport">
							{Object.values(Sport).map((sport) => (
								<MenuItem key={sport} value={sport}>
									{sport}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 6 }}>
					<TextField
						required
						fullWidth
						label="Identifier"
						name="identifier"
					/>
				</Grid>
				<Grid size={"grow"}>
					<Button
						type="submit"
						variant="contained"
						color="success"
						fullWidth
						sx={{ height: "100%" }}
					>
						Submit
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}

function RouteComponent() {
	const [addShooterFormOpen, setAddShooterFormOpen] = useState(false);
	const { data: shooterProfiles } = useSelfShooterProfiles();

	return (
		<Container maxWidth="md">
			<Paper sx={{ p: 2 }}>
				<Typography variant="h4" sx={{ p: 1 }} textAlign="center">
					Shooter Profile Management
				</Typography>
				<Paper variant="outlined" sx={{ p: 1 }}>
					<Stack divider={<Divider />}>
						{shooterProfiles?.data?.items.map((shooterProfile) => (
							<ShooterCard
								key={shooterProfile.id}
								id={shooterProfile.id}
								sport={shooterProfile.sport}
								identifier={shooterProfile.identifier}
								image={shooterProfile.image?.uuid}
							/>
						))}
						{shooterProfiles?.data?.items.length === 0 && (
							<Typography
								variant="h6"
								textAlign="center"
								sx={{ p: 2 }}
							>
								No shooter profiles found. Click the button
								below to add a new one.
							</Typography>
						)}
						<Button
							sx={{ mt: 1 }}
							variant="contained"
							onClick={() =>
								setAddShooterFormOpen(!addShooterFormOpen)
							}
						>
							Add shooter profile
						</Button>
						<Collapse in={addShooterFormOpen}>
							<AddShooterForm
								onCreate={() => setAddShooterFormOpen(false)}
							/>
						</Collapse>
					</Stack>
				</Paper>
			</Paper>
		</Container>
	);
}
