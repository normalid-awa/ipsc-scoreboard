import {
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	type Rel,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Account {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@Property({ fieldName: "accountId", type: "text" })
	accountId!: string;

	@Property({ fieldName: "providerId", type: "text" })
	providerId!: string;

	@ManyToOne({
		entity: () => User,
		deleteRule: "cascade",
	})
	user!: Rel<User>;

	@Property({ fieldName: "accessToken", type: "text", nullable: true })
	accessToken?: string;

	@Property({ fieldName: "refreshToken", type: "text", nullable: true })
	refreshToken?: string;

	@Property({ fieldName: "idToken", type: "text", nullable: true })
	idToken?: string;

	@Property({
		fieldName: "accessTokenExpiresAt",
		columnType: "timestamp(6)",
		nullable: true,
	})
	accessTokenExpiresAt?: Date;

	@Property({
		fieldName: "refreshTokenExpiresAt",
		columnType: "timestamp(6)",
		nullable: true,
	})
	refreshTokenExpiresAt?: Date;

	@Property({ type: "text", nullable: true })
	scope?: string;

	@Property({ type: "text", nullable: true })
	password?: string;

	@Property({ fieldName: "createdAt", columnType: "timestamp(6)" })
	createdAt!: Date;

	@Property({ fieldName: "updatedAt", columnType: "timestamp(6)" })
	updatedAt!: Date;
}
