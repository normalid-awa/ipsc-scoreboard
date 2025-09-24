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
		IPSC: "IpscStage",
		IDPA: "IdpaStage",
		AAIPSC: "AaipscStage",
		USPSA: "UspsaStage",
		ThreeGun: "ThreegunStage",
	} satisfies StageDiscriminator,
})
export class Stage {
	@PrimaryKey()
	id!: number;

	@Property()
	title!: string;

	@Property()
	description!: string;

	@ManyToOne()
	creator!: User;
}

export class IpscStage extends Stage {
	@Property()
	paperTargets!: {
		targetId: number;
		requiredHits: number;
		hasNoShoot: boolean;
		isNoPenaltyMiss: boolean;
	}[];

	@Property()
	steelTargets!: {
		targetId: number;
		isNoShoot: boolean;
	}[];

	/** Time in seconds */
	@Property()
	walkthroughTime!: number;

	@Property({ persist: false })
	get stageType(): "short" | "medium" | "long" | "uncategorized" {
		let shoots = 0;
		this.paperTargets.forEach((target) => {
			shoots += target.requiredHits;
		});
		this.steelTargets.forEach((target) => {
			if (!target.isNoShoot) shoots += 1;
		});

		if (shoots <= 12) return "short";
		else if (shoots <= 24) return "medium";
		else if (shoots <= 32) return "long";
		return "uncategorized";
	}
}

export class IdpaStage extends Stage {
	@Property()
	paperTargets!: number;

	@Property()
	steelTargets!: number;

	@Property()
	walkthroughTime!: number;
}

export class AaipscStage extends Stage {
	@Property()
	paperTargets!: {
		targetId: number;
		requiredHits: number;
		hasNoShoot: boolean;
		isNoPenaltyMiss: boolean;
	}[];

	@Property()
	steelTargets!: {
		targetId: number;
		isNoShoot: boolean;
	}[];

	/** Time in seconds */
	@Property()
	walkthroughTime!: number;

	@Property({ persist: false })
	get stageType(): "short" | "medium" | "long" | "uncategorized" {
		let shoots = 0;
		this.paperTargets.forEach((target) => {
			shoots += target.requiredHits;
		});
		this.steelTargets.forEach((target) => {
			if (!target.isNoShoot) shoots += 1;
		});

		if (shoots <= 12) return "short";
		else if (shoots <= 24) return "medium";
		else if (shoots <= 32) return "long";
		return "uncategorized";
	}
}

export class UspsaStage extends Stage {}

export class ThreegunStage extends Stage {}
