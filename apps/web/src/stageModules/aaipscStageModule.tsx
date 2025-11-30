import { StageDataInput } from "@/components/stage/StageDataInput";
import {
	AaipscPaperTarget,
	AaipscStage,
	AaipscSteelTarget,
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

export const MixinAaipscFrontendStageModule: MixableFrontendStageModule<
	AaipscStage
> = (base) => {
	return class MixedAaipscFrontendStageModule
		extends base
		implements FrontendStageModule<AaipscStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		stageDataInputForm(
			setStageData: (
				changes: Partial<StageSpecificData<AaipscStage>>,
			) => void,
		) {
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<AaipscStage, AaipscSteelTarget>
						stageData={this.stage}
						setStageData={setStageData}
						fieldName="aaipscSteelTargets"
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
					<StageDataInput<AaipscStage, AaipscPaperTarget>
						stageData={this.stage}
						setStageData={setStageData}
						fieldName="aaipscPaperTargets"
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
				</Stack>
			);
		}

		async submitStage(data: EditingStageData<AaipscStage>) {
			const res = await api.stage.ipsc.post({
				images: data.rawFiles ?? [],
				ipscPaperTargets: data.aaipscPaperTargets ?? [],
				ipscSteelTargets: data.aaipscSteelTargets ?? [],
				title: data.title ?? "",
				walkthroughTime: data.walkthroughTime ?? 0,
				description: data.description,
			});
			if (res.error) return false;
			return true;
		}
	};
};
