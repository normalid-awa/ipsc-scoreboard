import { SportEnum } from "@ipsc_scoreboard/api";
import { AaipscStageModule } from "./aaipscStageModule.js";
import { IdpaStageModule } from "./idpaStageModule.js";
import { IpscStageModule } from "./ipscStageModule.js";
import { UspsaStageModule } from "./uspsaStageModule.js";

export const StageModules = {
	[SportEnum.IPSC]: IpscStageModule,
	[SportEnum.AAIPSC]: AaipscStageModule,
	[SportEnum.IDPA]: IdpaStageModule,
	[SportEnum.USPSA]: UspsaStageModule,
} as const;
