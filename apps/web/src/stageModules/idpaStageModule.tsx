import { IdpaStage } from "@ipsc_scoreboard/api";
import Stack from "@mui/material/Stack";
import {
	FrontendStageModule,
	MixableFrontendStageModule,
	StageSpecificData,
} from "./stageModules";

export const MixinIdpaFrontendStageModule: MixableFrontendStageModule<
	IdpaStage
> = (base) => {
	return class MixedIdpaFrontendStageModule
		extends base
		implements FrontendStageModule<IdpaStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		//TODO: Implement IDPA specific stage data input form
		stageDataInputForm(
			stageData: Partial<StageSpecificData<IdpaStage>>,
			setStageData: (
				changes: Partial<StageSpecificData<IdpaStage>>,
			) => void,
		) {
			return <Stack></Stack>;
		}
	};
};
