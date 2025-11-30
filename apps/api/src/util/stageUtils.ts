import { UnionStage } from "@/database/entities/stage.entity.js";
import { SportEnum } from "@/sport.js";

export function calculateMinimumRounds(
	paperTarget: { requiredHits: number }[],
	steelTargets: { isNoShoot: boolean }[],
) {
	let rounds = 0;
	paperTarget.forEach((v) => {
		rounds += v.requiredHits;
	});
	steelTargets.forEach((v) => {
		if (!v.isNoShoot) rounds++;
	});
	return rounds;
}

export function calculateUniversalMinimumRounds(stageData: UnionStage) {
	let paperTargets: { requiredHits: number }[];
	let steelTargets: { isNoShoot: boolean }[];
	switch (stageData.type) {
		case SportEnum.AAIPSC:
			paperTargets = stageData.aaipscPaperTargets ?? [];
			steelTargets = stageData.aaipscSteelTargets ?? [];
			break;
		case SportEnum.IDPA:
			paperTargets = new Array(stageData.idpaPaperTargets ?? 0).fill({
				requiredHits: 2,
			});
			steelTargets = new Array(stageData.idpaSteelTargets ?? 0).fill({
				isNoShoot: false,
			});
			break;
		case SportEnum.IPSC:
			paperTargets = stageData.ipscPaperTargets ?? [];
			steelTargets = stageData.ipscSteelTargets ?? [];
			break;
		case SportEnum.USPSA:
			paperTargets = stageData.uspsaPaperTargets ?? [];
			steelTargets = stageData.uspsaSteelTargets ?? [];
			break;
		default:
			paperTargets = [];
			steelTargets = [];
	}

	calculateMinimumRounds(paperTargets, steelTargets);
}
