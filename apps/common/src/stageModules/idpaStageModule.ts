import { IdpaStage } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class IdpaStageModule extends StageModule<IdpaStage> {
	getMinimumRounds(): number {
		return (
			this.stage.idpaPaperTargets * 2 + this.stage.idpaSteelTargets * 2
		);
	}
}
