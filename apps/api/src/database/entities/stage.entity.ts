import {
	Entity,
	Enum,
	Formula,
	ManyToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { SportMap } from "@/sport.js";

type StageDiscriminator = {
	[k in keyof typeof SportMap]: `${Capitalize<Lowercase<k & string>>}Stage`;
};

@Entity({
	discriminatorColumn: "type",
	discriminatorMap: {
		Stage: "Stage",
		IPSC: "IpscStage",
		IDPA: "IdpaStage",
		AAIPSC: "AaipscStage",
		USPSA: "UspsaStage",
	} satisfies StageDiscriminator | { Stage: "Stage" },
})
export class Stage {
	@PrimaryKey()
	id!: number;

	@Property()
	title!: string;

	@Property()
	description?: string;

	/** Time in seconds */
	@Property()
	walkthroughTime!: number;

	@ManyToOne()
	creator!: User;
}

@Entity()
export class IpscStage extends Stage {
	@Property({ type: "jsonb" })
	ipscPaperTargets!: {
		targetId: number;
		requiredHits: number;
		hasNoShoot: boolean;
		isNoPenaltyMiss: boolean;
	}[];

	@Property({ type: "jsonb" })
	ipscSteelTargets!: {
		targetId: number;
		isNoShoot: boolean;
	}[];

	@Formula(
		(alias) =>
			`sum(cast(${alias}.ipsc_papper_targets->>'requiredHits' as integer)) + sum(cast(${alias}.ipsc_steel_targets->>'isNoShoot' as integer))`,
	)
	minimumRounds!: number;

	@Property({ persist: false })
	get stageType(): "short" | "medium" | "long" | "uncategorized" {
		if (this.minimumRounds <= 12) return "short";
		else if (this.minimumRounds <= 24) return "medium";
		else if (this.minimumRounds <= 32) return "long";
		return "uncategorized";
	}
}

@Entity()
export class IdpaStage extends Stage {
	@Property()
	idpaPaperTargets!: number;

	@Property()
	idpaSteelTargets!: number;
}

@Entity()
export class AaipscStage extends Stage {
	@Property({ type: "jsonb" })
	aaipscPaperTargets!: {
		targetId: number;
		requiredHits: number;
		hasNoShoot: boolean;
		isNoPenaltyMiss: boolean;
	}[];

	@Property({ type: "jsonb" })
	aaipscSteelTargets!: {
		targetId: number;
		isNoShoot: boolean;
	}[];

	@Formula(
		(alias) =>
			`sum(cast(${alias}.aaipsc_papper_targets->>'requiredHits' as integer)) + sum(cast(${alias}.aaipsc_steel_targets->>'isNoShoot' as integer))`,
	)
	minimumRounds!: number;

	@Property({ persist: false })
	get stageType(): "short" | "medium" | "long" | "uncategorized" {
		if (this.minimumRounds <= 12) return "short";
		else if (this.minimumRounds <= 24) return "medium";
		else if (this.minimumRounds <= 32) return "long";
		return "uncategorized";
	}
}

export enum UspsaScoringMethod {
	Comstock = "Comstock",
	VirginiaCount = "Virginia Count",
	FixedTime = "Fixed Time",
}

@Entity()
export class UspsaStage extends Stage {
	@Property({ type: "jsonb" })
	uspsaPaperTargets!: {
		targetId: number;
		requiredHits: number;
		hasNoShoot: boolean;
		isNoPenaltyMiss: boolean;
	}[];

	@Property({ type: "jsonb" })
	uspsaSteelTargets!: {
		targetId: number;
		isNoShoot: boolean;
	}[];

	@Enum({
		name: "uspsa_scoring_method",
		items: () => UspsaScoringMethod,
		nativeEnumName: "uspsa_scoring_method",
	})
	uspsaScoringMethod!: UspsaScoringMethod;

	@Formula(
		(alias) =>
			`sum(cast(${alias}.uspsa_papper_targets->>'requiredHits' as integer)) + sum(cast(${alias}.uspsa_steel_targets->>'isNoShoot' as integer))`,
	)
	minimumRounds!: number;

	@Property({ persist: false })
	get stageType(): "short" | "medium" | "long" | "uncategorized" {
		if (this.minimumRounds <= 12) return "short";
		else if (this.minimumRounds <= 20) return "medium";
		else if (this.minimumRounds <= 32) return "long";
		return "uncategorized";
	}
}
