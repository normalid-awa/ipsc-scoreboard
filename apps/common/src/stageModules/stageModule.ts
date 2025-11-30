import { Stage } from "@ipsc_scoreboard/api";

export abstract class StageModule<
	StageModal extends Stage,
	StageSpecificData extends object = Omit<StageModal, keyof Stage>,
> {
	constructor(public stage: StageModal) {}

	abstract getMinimumRounds(): number;
}
