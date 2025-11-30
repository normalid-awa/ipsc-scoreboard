import { StageDataInput } from "@/components/stage/StageDataInput";
import {
	IpscPaperTarget,
	IpscStage,
	IpscSteelTarget,
} from "@ipsc_scoreboard/api";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	FrontendStageModule,
	MixableFrontendStageModule,
	StageSpecificData,
} from "./stageModules";
import { api } from "@/api";
import { EditingStageData } from "@/routes/stages/create";

export const MixinIpscFrontendStageModule: MixableFrontendStageModule<
	IpscStage
> = (base) => {
	return class MixedIpscFrontendStageModule
		extends base
		implements FrontendStageModule<IpscStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		stageDataInputForm(
			setStageData: (
				changes: Partial<StageSpecificData<IpscStage>>,
			) => void,
		) {
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<IpscStage, IpscSteelTarget>
						stageData={this.stage}
						setStageData={setStageData}
						fieldName="ipscSteelTargets"
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
					<StageDataInput<IpscStage, IpscPaperTarget>
						stageData={this.stage}
						setStageData={setStageData}
						fieldName="ipscPaperTargets"
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

		async submitStage(data: EditingStageData<IpscStage>) {
			const res = await api.stage.ipsc.post({
				images: data.rawFiles ?? [],
				ipscPaperTargets: data.ipscPaperTargets ?? [],
				ipscSteelTargets: data.ipscSteelTargets ?? [],
				title: data.title ?? "",
				walkthroughTime: data.walkthroughTime ?? 0,
				description: data.description,
			});
			if (res.error) return false;
			return true;
		}
	};
};
