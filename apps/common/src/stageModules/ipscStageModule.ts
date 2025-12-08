import { IpscStage } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class IpscStageModule extends StageModule<IpscStage> {
	getMinimumRounds(): number {
		let rounds = 0;
		this.stage.ipscPaperTargets.forEach((v) => {
			rounds += v.requiredHits;
		});
		this.stage.ipscSteelTargets.forEach((v) => {
			if (!v.isNoShoot) rounds++;
		});
		return rounds;
	}
}
