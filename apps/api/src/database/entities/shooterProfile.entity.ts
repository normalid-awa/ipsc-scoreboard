import { SportEnum } from "../../sport.js";
import {
	Cascade,
	Entity,
	Enum,
	ManyToOne,
	OneToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { SoftDeletableEntity } from "../softDelete.js";
import { Image } from "./image.entity.js";

@Entity()
export class ShooterProfile extends SoftDeletableEntity {
	@PrimaryKey()
	id!: number;

	@Enum({ nativeEnumName: "shooter_profile_sport" })
	sport!: SportEnum;

	@Property()
	identifier!: string;

	@ManyToOne()
	user?: User;

	@OneToOne({ cascade: [Cascade.PERSIST] })
	image?: Image;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
}
