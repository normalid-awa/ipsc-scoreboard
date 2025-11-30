import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	SportEnum,
	Stage,
	UspsaStage,
} from "@ipsc_scoreboard/api";
import { StageModules } from "@ipsc_scoreboard/common/stageModules";
import { StageModule } from "@ipsc_scoreboard/common/stageModule";
import { ReactElement } from "react";
import { MixinIpscFrontendStageModule } from "./ipscStageModule";
import { MixinAaipscFrontendStageModule } from "./aaipscStageModule";
import { MixinUspsaFrontendStageModule } from "./uspsaStageModule";
import { MixinIdpaFrontendStageModule } from "./idpaStageModule";

type Constructor<T = {}> = new (...args: any[]) => T;
type Concreatize<T> = { [K in keyof T]: T[K] };
export type StageSpecificData<StageModal> = Omit<StageModal, keyof Stage>;

export interface FrontendStageModule<
	StageModal extends Stage,
	StageSpecificData extends object = Omit<StageModal, keyof Stage>,
> {
	stageDataInputForm: (
		stageData: Partial<StageSpecificData>,
		setStageData: (changes: Partial<StageSpecificData>) => void,
	) => ReactElement;
}

export type MixableFrontendStageModule<
	TStage extends Stage,
	TBase = Constructor<Concreatize<StageModule<TStage>>>,
> = (
	base: TBase,
) => Constructor<
	Concreatize<StageModule<TStage>> & FrontendStageModule<TStage>
>;

export const FrontendStageModules = {
	[SportEnum.IPSC]: (stageData: StageSpecificData<IpscStage>) =>
		new (MixinIpscFrontendStageModule(StageModules.IPSC))(stageData),
	[SportEnum.AAIPSC]: (stageData: StageSpecificData<AaipscStage>) =>
		new (MixinAaipscFrontendStageModule(StageModules.AAIPSC))(stageData),
	[SportEnum.USPSA]: (stageData: StageSpecificData<UspsaStage>) =>
		new (MixinUspsaFrontendStageModule(StageModules.USPSA))(stageData),
	[SportEnum.IDPA]: (stageData: StageSpecificData<IdpaStage>) =>
		new (MixinIdpaFrontendStageModule(StageModules.IDPA))(stageData),
} as const;
