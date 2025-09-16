import {
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	type Rel,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Session {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@Property({ fieldName: "expiresAt", columnType: "timestamp(6)" })
	expiresAt!: Date;

	@Property({ type: "text", unique: "session_token_key" })
	token!: string;

	@Property({ fieldName: "createdAt", columnType: "timestamp(6)" })
	createdAt!: Date;

	@Property({ fieldName: "updatedAt", columnType: "timestamp(6)" })
	updatedAt!: Date;

	@Property({ fieldName: "ipAddress", type: "text", nullable: true })
	ipAddress?: string;

	@Property({ fieldName: "userAgent", type: "text", nullable: true })
	userAgent?: string;

	@ManyToOne({
		entity: () => User,
		deleteRule: "cascade",
	})
	user!: Rel<User>;

	@Property({
		type: "text",
		nullable: true,
	})
	activeOrganization?: string;
}
