import { StageDataInput } from "@/components/stage/StageDataInput";
import {
	UspsaPaperTarget,
	UspsaScoringMethod,
	UspsaStage,
	UspsaSteelTarget,
} from "@ipsc_scoreboard/api";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	FrontendStageModule,
	MixableFrontendStageModule,
	StageSpecificData,
} from "./stageModules";
import { EditingStageData } from "@/routes/stages/create";
import { api } from "@/api";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const MixinUspsaFrontendStageModule: MixableFrontendStageModule<
	UspsaStage
> = (base) => {
	return class MixedUspsaFrontendStageModule
		extends base
		implements FrontendStageModule<UspsaStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		stageDataInputForm(
			setStageData: (
				changes: Partial<StageSpecificData<UspsaStage>>,
			) => void,
		) {
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<UspsaStage, UspsaSteelTarget>
						stageData={this.stage}
						setStageData={setStageData}
						fieldName="uspsaSteelTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "isNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
					<Divider sx={{ my: 1 }} />
					<Typography variant="h5">Paper targets</Typography>
					<StageDataInput<UspsaStage, UspsaPaperTarget>
						stageData={this.stage}
						setStageData={setStageData}
						fieldName="uspsaPaperTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "requiredHits",
								label: "Required Hits",
								type: "number",
								defaultValue: 2,
								followPrevious: true,
							},
							{
								name: "hasNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
							{
								name: "isNoPenaltyMiss",
								label: "Enable no-penalty-miss",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
					<FormControl fullWidth sx={{ mt: 2 }}>
						<InputLabel>Scoring method</InputLabel>
						<Select
							value={
								this.stage.uspsaScoringMethod ??
								UspsaScoringMethod.Comstock
							}
							label="Scoring method"
							onChange={(event) => {
								setStageData({
									...this.stage,
									uspsaScoringMethod: event.target
										.value as UspsaScoringMethod,
								});
							}}
						>
							{Object.values(UspsaScoringMethod).map((method) => (
								<MenuItem key={method} value={method}>
									{method}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			);
		}

		//TODO: JSON.stringify should remove after https://github.com/elysiajs/eden/pull/229 is merged
		async submitStage(data: EditingStageData<UspsaStage>) {
			const res = await api.stage.uspsa.post({
				images: data.rawFiles ?? [],
				uspsaPaperTargets: JSON.stringify(
					data.uspsaPaperTargets ?? [],
				) as unknown as [],
				uspsaSteelTargets: JSON.stringify(
					data.uspsaSteelTargets ?? [],
				) as unknown as [],
				uspsaScoringMethod:
					data.uspsaScoringMethod ?? UspsaScoringMethod.Comstock,
				title: data.title ?? "",
				walkthroughTime: data.walkthroughTime ?? 0,
				description: data.description,
			});
			if (res.error) return false;
			return true;
		}
	};
};
