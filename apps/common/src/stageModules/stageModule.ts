import { SportEnum, Stage } from "@ipsc_scoreboard/api";
import { IpscStageModule } from "./ipscStageModule.js";
import { AaipscStageModule } from "./aaipscStageModule.js";
import { IdpaStageModule } from "./idpaStageModule.js";
import { UspsaStageModule } from "./uspsaStageModule.js";

export abstract class StageModule<StageModal extends Stage> {
	constructor(public stage: StageModal) {}

	abstract getMinimumRounds(): number;
}

export const StageModules = {
	[SportEnum.IPSC]: IpscStageModule,
	[SportEnum.AAIPSC]: AaipscStageModule,
	[SportEnum.IDPA]: IdpaStageModule,
	[SportEnum.USPSA]: UspsaStageModule,
} as const;
