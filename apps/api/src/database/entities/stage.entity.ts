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
import { SportMap } from "@/sport.js";

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
