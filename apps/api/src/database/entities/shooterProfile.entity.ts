import { Sport } from "../../sport.js";
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { SoftDeletableEntity } from "../softDelete.js";

@Entity()
export class ShooterProfile extends SoftDeletableEntity {
	@PrimaryKey()
	id!: number;

	@Enum({ items: () => Sport, nativeEnumName: "shooter_profile_sport" })
	sport!: Sport;

	@Property()
	identifier!: string;

	@ManyToOne()
	user?: User;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
}
