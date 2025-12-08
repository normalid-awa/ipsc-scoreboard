import {
	Cascade,
	Entity,
	Enum,
	ManyToOne,
	OneToOne,
	PrimaryKey,
	Property,
	type Rel,
} from "@mikro-orm/core";
import { SportEnum } from "../../sport.js";
import { SoftDeletableEntity } from "../softDelete.js";
import { Club } from "./club.entity.js";
import { Image } from "./image.entity.js";
import { User } from "./user.entity.js";

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

	@ManyToOne()
	club?: Rel<Club>;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
}
