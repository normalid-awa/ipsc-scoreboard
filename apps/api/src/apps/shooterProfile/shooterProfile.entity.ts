import {
	Entity,
	Enum,
	ManyToOne,
	PrimaryKey,
	Property,
	Unique,
} from "@mikro-orm/postgresql";
import { Sports } from "../../types.js";
import { User } from "../auth/entities/user.entity.js";

@Entity()
@Unique({ properties: ["sport", "identifier"] })
@Unique({ properties: ["user", "sport"] })
export class ShooterProfile {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@ManyToOne({ nullable: true })
	user?: User;

	@Enum()
	sport!: Sports;

	@Property()
	identifier!: string; // unique identifier for the shooter at the sport

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
}
