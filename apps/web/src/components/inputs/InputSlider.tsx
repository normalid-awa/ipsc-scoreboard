import {
	Box,
	Grid,
	Input,
	InputAdornment,
	Slider,
	Typography,
} from "@mui/material";

export interface InputSliderProps<T extends number | number[]> {
	label: string;
	value: T;
	onChange: (newValue: T) => void;
	min: number;
	max: number;
	step?: number;
	unit?: string;
}

export default function InputSlider(
	props: InputSliderProps<number | number[]>,
) {
	const handleSliderChange = (event: Event, newValue: number | number[]) => {
		props.onChange(newValue);
	};

	const handleSingleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		props.onChange(
			event.target.value === "" ? 0 : Number(event.target.value),
		);
	};

	const handleFirstInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		props.onChange([
			event.target.value === "" ? 0 : Number(event.target.value),
			//@ts-expect-error The props value must be arrray in this case
			props.value[1],
		]);
	};

	const handleSecondInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		props.onChange([
			//@ts-expect-error The props value must be arrray in this case
			props.value[0],
			event.target.value === "" ? 0 : Number(event.target.value),
		]);
	};

	const handleBlur = () => {
		if (Array.isArray(props.value)) {
			//clamp to min and max
			props.onChange([
				Math.max(props.min, Math.min(props.max, props.value[0])),
				Math.max(props.min, Math.min(props.max, props.value[1])),
			]);
		} else {
			//clamp to min and max
			props.onChange(
				Math.max(props.min, Math.min(props.max, props.value)),
			);
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Grid container spacing={1} sx={{ alignItems: "center" }}>
				<Grid size={{ xs: 12, sm: "auto" }}>
					<Typography variant="subtitle1" align="center">
						{props.label}
					</Typography>
				</Grid>
				{Array.isArray(props.value) ? (
					<Grid size={{ xs: 2.5 }}>
						<Input
							value={props.value[0]}
							size="small"
							onChange={handleFirstInputChange}
							onBlur={handleBlur}
							inputProps={{
								step: props.step,
								min: props.min,
								max: props.max,
								type: "number",
							}}
							endAdornment={
								<InputAdornment position="end">
									{props.unit}
								</InputAdornment>
							}
						/>
					</Grid>
				) : null}
				<Grid size="grow">
					<Slider
						value={props.value}
						min={props.min}
						max={props.max}
						step={props.step}
						onChange={handleSliderChange}
						getAriaValueText={(value) => `${value} ${props.unit}`}
						valueLabelDisplay="auto"
					/>
				</Grid>
				<Grid size={{ xs: "auto" }}>
					<Input
						value={
							Array.isArray(props.value)
								? props.value[1]
								: props.value
						}
						size="small"
						onChange={
							Array.isArray(props.value)
								? handleSecondInputChange
								: handleSingleInputChange
						}
						onBlur={handleBlur}
						inputProps={{
							step: props.step,
							min: props.min,
							max: props.max,
							type: "number",
						}}
						endAdornment={
							<InputAdornment position="end">
								{props.unit}
							</InputAdornment>
						}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
