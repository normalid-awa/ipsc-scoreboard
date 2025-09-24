import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
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
}

export class IdpaStage extends Stage {}

export class AaipscStage extends Stage {}

export class UspsaStage extends Stage {}

export class ThreegunStage extends Stage {}
