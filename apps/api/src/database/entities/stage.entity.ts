import {
	BeforeCreate,
	BeforeUpdate,
	Entity,
	Enum,
	Formula,
	ManyToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { SportEnum, SportMap } from "@/sport.js";

type StageDiscriminator = {
	[k in keyof typeof SportMap]: `${Capitalize<Lowercase<k & string>>}Stage`;
};

function calculateMinimumRounds(
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

function generateStageTypeSql(
	typeMap: Record<number, string>,
	minimumRoundField: string,
) {
	let sql = `CASE`;
	for (const [key, value] of Object.entries(typeMap)) {
		sql += `
	WHEN ${minimumRoundField} <= ${key} THEN '${value}'`;
	}
	sql += `
	ELSE 'uncategorized'
END`;
	return sql;
}

export const isIpscStage = (stage?: Stage | null): stage is IpscStage =>
	stage?.type === "IPSC";
export const isIdpaStage = (stage?: Stage | null): stage is IdpaStage =>
	stage?.type === "IDPA";
export const isAaipscStage = (stage?: Stage | null): stage is AaipscStage =>
	stage?.type === "AAIPSC";
export const isUspsaStage = (stage?: Stage | null): stage is UspsaStage =>
	stage?.type === "USPSA";

export type UnionStage = IpscStage | IdpaStage | AaipscStage | UspsaStage;

@Entity({
	discriminatorColumn: "type",
	discriminatorMap: {
		IPSC: "IpscStage",
		IDPA: "IdpaStage",
		AAIPSC: "AaipscStage",
		USPSA: "UspsaStage",
	} satisfies StageDiscriminator,
})
export class Stage {
	@PrimaryKey()
	id!: number;

	@Enum()
	type!: SportEnum;

	@Property()
	title!: string;

	@Property()
	description?: string;

	/** Time in seconds */
	@Property()
	walkthroughTime!: number;

	@ManyToOne()
	creator!: User;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
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

	@Property()
	minimumRounds!: number;

	@Formula((alias) =>
		generateStageTypeSql(
			{ 12: "short", 24: "medium", 32: "long" },
			`${alias}.minimum_rounds`,
		),
	)
	stageType!: "short" | "medium" | "long" | "uncategorized";

	@BeforeCreate()
	@BeforeUpdate()
	protected updateMinimumRounds() {
		this.minimumRounds = calculateMinimumRounds(
			this.ipscPaperTargets,
			this.ipscSteelTargets,
		);
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

	@Property()
	minimumRounds!: number;

	@Formula((alias) =>
		generateStageTypeSql(
			{ 12: "short", 20: "medium", 32: "long" },
			`${alias}.minimum_rounds`,
		),
	)
	stageType!: "short" | "medium" | "long" | "uncategorized";

	@BeforeCreate()
	@BeforeUpdate()
	protected updateMinimumRounds() {
		this.minimumRounds = calculateMinimumRounds(
			this.aaipscPaperTargets,
			this.aaipscSteelTargets,
		);
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

	@Property()
	minimumRounds!: number;

	@Formula((alias) =>
		generateStageTypeSql(
			{ 12: "short", 20: "medium", 32: "long" },
			`${alias}.minimum_rounds`,
		),
	)
	readonly stageType!: "short" | "medium" | "long" | "uncategorized";

	@BeforeCreate()
	@BeforeUpdate()
	protected updateMinimumRounds() {
		this.minimumRounds = calculateMinimumRounds(
			this.uspsaPaperTargets,
			this.uspsaSteelTargets,
		);
	}
}
