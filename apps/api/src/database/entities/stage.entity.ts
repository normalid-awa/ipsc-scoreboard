import {
	BeforeCreate,
	BeforeUpdate,
	Cascade,
	Collection,
	Entity,
	Enum,
	Formula,
	ManyToMany,
	ManyToOne,
	PrimaryKey,
	Property,
	type Rel,
} from "@mikro-orm/postgresql";
import { User } from "./user.entity.js";
import { SportEnum, SportMap } from "../../sport.js";
import { Image } from "./image.entity.js";
import { Static, t } from "elysia";

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

export type UnionStage = IpscStage | IdpaStage | AaipscStage | UspsaStage;

@Entity()
export class StageImage {
	@ManyToOne({ primary: true, cascade: [Cascade.ALL], nullable: false })
	stage!: Rel<Stage>;

	@ManyToOne({ primary: true, cascade: [Cascade.ALL], nullable: false })
	image!: Rel<Image>;

	@Property()
	order!: number;

	constructor(stage: Rel<Stage>, image: Rel<Image>, order: number) {
		this.stage = stage;
		this.image = image;
		this.order = order;
	}
}

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
	readonly type!: SportEnum;

	@Property()
	title!: string;

	@Property({ type: "text" })
	description?: string;

	/** Time in seconds */
	@Property()
	walkthroughTime!: number;

	@ManyToMany({
		entity: () => Image,
		pivotEntity: () => StageImage,
		fixedOrder: true,
		fixedOrderColumn: "order",
		eager: true,
	})
	images = new Collection<Image>(this);

	@ManyToOne()
	creator!: User;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
}

export const ipscPaperTargetSchema = t.Object({
	targetId: t.Integer(),
	requiredHits: t.Integer(),
	hasNoShoot: t.Boolean(),
	isNoPenaltyMiss: t.Boolean(),
});

export const ipscSteelTargetSchema = t.Object({
	targetId: t.Integer(),
	isNoShoot: t.Boolean(),
});

@Entity()
export class IpscStage extends Stage {
	@Property({ type: "jsonb" })
	ipscPaperTargets!: Static<typeof ipscPaperTargetSchema>[];

	@Property({ type: "jsonb" })
	ipscSteelTargets!: Static<typeof ipscSteelTargetSchema>[];

	@Property({ name: "minimum_rounds" })
	minimumRounds!: number;

	@Formula((alias) =>
		generateStageTypeSql(
			{ 12: "short", 24: "medium", 32: "long" },
			`${alias}.minimum_rounds`,
		),
	)
	readonly stageType!: "short" | "medium" | "long" | "uncategorized";

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

export const aaipscPaperTargetSchema = t.Object({
	targetId: t.Integer(),
	requiredHits: t.Integer(),
	hasNoShoot: t.Boolean(),
	isNoPenaltyMiss: t.Boolean(),
});

export const aaipscSteelTargetSchema = t.Object({
	targetId: t.Integer(),
	isNoShoot: t.Boolean(),
});

@Entity()
export class AaipscStage extends Stage {
	@Property({ type: "jsonb" })
	aaipscPaperTargets!: Static<typeof aaipscPaperTargetSchema>[];

	@Property({ type: "jsonb" })
	aaipscSteelTargets!: Static<typeof aaipscSteelTargetSchema>[];

	@Property({ name: "minimum_rounds" })
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

export const uspsaPaperTargetSchema = t.Object({
	targetId: t.Integer(),
	requiredHits: t.Integer(),
	hasNoShoot: t.Boolean(),
	isNoPenaltyMiss: t.Boolean(),
});

export const uspsaSteelTargetSchema = t.Object({
	targetId: t.Integer(),
	isNoShoot: t.Boolean(),
});

@Entity()
export class UspsaStage extends Stage {
	@Property({ type: "jsonb" })
	uspsaPaperTargets!: Static<typeof uspsaPaperTargetSchema>[];

	@Property({ type: "jsonb" })
	uspsaSteelTargets!: Static<typeof uspsaSteelTargetSchema>[];

	@Enum({
		name: "uspsa_scoring_method",
		items: () => UspsaScoringMethod,
		nativeEnumName: "uspsa_scoring_method",
	})
	uspsaScoringMethod!: UspsaScoringMethod;

	@Property({ name: "minimum_rounds" })
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
