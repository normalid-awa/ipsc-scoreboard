import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	SportEnum,
	Stage,
	UnionStage,
	UspsaStage,
} from "@ipsc_scoreboard/api";
import { StageModules } from "@ipsc_scoreboard/common/stageModules";
import { StageModule } from "@ipsc_scoreboard/common/stageModule";
import { ReactElement } from "react";
import { MixinIpscFrontendStageModule } from "./ipscStageModule";
import { MixinAaipscFrontendStageModule } from "./aaipscStageModule";
import { MixinUspsaFrontendStageModule } from "./uspsaStageModule";
import { MixinIdpaFrontendStageModule } from "./idpaStageModule";
import { EditingStageData } from "@/routes/stages/create";

type Constructor<T = {}> = new (...args: any[]) => T;
type Concreatize<T> = { [K in keyof T]: T[K] };
export type StageSpecificData<StageModal> = Omit<StageModal, keyof Stage>;

export interface FrontendStageModule<
	StageModal extends Stage,
	StageSpecificData extends object = Omit<StageModal, keyof Stage>,
> {
	stageDataInputForm: (
		setStageData: (changes: Partial<StageSpecificData>) => void,
	) => ReactElement;

	/**
	 * Submit stage data to backend
	 * @param data Data to submit
	 * @returns If success return stage id, else undefined
	 */
	submitStage(
		data: EditingStageData<StageModal>,
	): Promise<number | undefined>;

	modifyStage(data: EditingStageData<StageModal>): Promise<boolean>;

	stageInfoDisplay(): ReactElement;
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
	[SportEnum.IPSC]: (
		stageData: StageSpecificData<IpscStage> | IpscStage | UnionStage,
	) => new (MixinIpscFrontendStageModule(StageModules.IPSC))(stageData),
	[SportEnum.AAIPSC]: (
		stageData: StageSpecificData<AaipscStage> | AaipscStage | UnionStage,
	) => new (MixinAaipscFrontendStageModule(StageModules.AAIPSC))(stageData),
	[SportEnum.USPSA]: (
		stageData: StageSpecificData<UspsaStage> | UspsaStage | UnionStage,
	) => new (MixinUspsaFrontendStageModule(StageModules.USPSA))(stageData),
	[SportEnum.IDPA]: (
		stageData: StageSpecificData<IdpaStage> | IdpaStage | UnionStage,
	) => new (MixinIdpaFrontendStageModule(StageModules.IDPA))(stageData),
} as const;
