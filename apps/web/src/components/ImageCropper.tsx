import React from "react";
// import {
// 	Button,
// 	Dialog,
// 	DialogActions,
// 	DialogContent,
// 	DialogTitle,
// 	FormControl,
// 	FormLabel,
// 	Paper,
// 	Slider,
// 	Stack,
// } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Cropper, { Area, Point } from "react-easy-crop";

//FROM https://codesandbox.io/p/sandbox/react-easy-crop-demo-with-cropped-output-q8q1mnr01w?file=%2Fsrc%2FcropImage.js%3A1%2C1-102%2C1
export const createImage = (url: string) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
		image.src = url;
	});

export function getRadianAngle(degreeValue: number) {
	return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
	const rotRad = getRadianAngle(rotation);

	return {
		width:
			Math.abs(Math.cos(rotRad) * width) +
			Math.abs(Math.sin(rotRad) * height),
		height:
			Math.abs(Math.sin(rotRad) * width) +
			Math.abs(Math.cos(rotRad) * height),
	};
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(
	imageSrc: string,
	pixelCrop: {
		x: number;
		y: number;
		width: number;
		height: number;
	},
	rotation = 0,
	flip = { horizontal: false, vertical: false },
) {
	const image = (await createImage(imageSrc)) as {
		width: number;
		height: number;
	};
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		return null;
	}

	const rotRad = getRadianAngle(rotation);

	// calculate bounding box of the rotated image
	const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
		image.width,
		image.height,
		rotation,
	);

	// set canvas size to match the bounding box
	canvas.width = bBoxWidth;
	canvas.height = bBoxHeight;

	// translate canvas context to a central location to allow rotating and flipping around the center
	ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
	ctx.rotate(rotRad);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-image.width / 2, -image.height / 2);

	// draw rotated image
	ctx.drawImage(image as CanvasImageSource, 0, 0);

	const croppedCanvas = document.createElement("canvas");

	const croppedCtx = croppedCanvas.getContext("2d");

	if (!croppedCtx) {
		return null;
	}

	// Set the size of the cropped canvas
	croppedCanvas.width = pixelCrop.width;
	croppedCanvas.height = pixelCrop.height;

	// Draw the cropped image onto the new canvas
	croppedCtx.drawImage(
		canvas,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	// As Base64 string
	return croppedCanvas.toDataURL("image/jpeg");
}

export interface ImageCropperProps {
	open: boolean;
	onClose: () => void;
	onChange: (base64img: string) => void;
	aspectRatio: number;
	imageSrc: string;
}
export default function ImageCropper(props: ImageCropperProps) {
	const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);
	const [rotation, setRotation] = React.useState(0);
	const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>();

	function onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
		setCroppedAreaPixels(croppedAreaPixels);
	}

	async function onSubmit() {
		try {
			const croppedImage = await getCroppedImg(
				props.imageSrc,
				croppedAreaPixels!,
				rotation,
			);
			props.onChange(croppedImage ?? "");
			props.onClose();
		} catch (e) {
			console.error(e);
			alert(`Error: ${JSON.stringify(e)}`);
		}
	}

	return (
		<Dialog
			open={props.open}
			onClose={props.onClose}
			maxWidth={"md"}
			fullWidth
		>
			<DialogTitle>Crop the image</DialogTitle>
			<DialogContent>
				<div
					style={{
						display: "flex",
						flex: "auto",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							position: "relative",
							height: "35vh",
						}}
					>
						<Cropper
							maxZoom={10}
							minZoom={0.1}
							image={props.imageSrc}
							crop={crop}
							zoom={zoom}
							rotation={rotation}
							aspect={props.aspectRatio}
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={onCropComplete}
							objectFit={"cover"}
						/>
					</div>
					<Stack>
						<FormControl>
							<FormLabel>Rotation</FormLabel>
							<Slider
								value={rotation}
								min={0}
								max={360}
								onChange={(e, v) => setRotation(v as number)}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Zoom</FormLabel>
							<Slider
								min={0}
								max={10}
								step={0.0001}
								value={zoom}
								onChange={(e, v) => setZoom(v as number)}
							/>
						</FormControl>
					</Stack>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button onClick={onSubmit}>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
}
