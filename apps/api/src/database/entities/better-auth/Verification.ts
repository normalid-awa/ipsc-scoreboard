import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Verification {
	@PrimaryKey({ type: "text" })
	id!: string;

	@Property({ type: "text" })
	identifier!: string;

	@Property({ type: "text" })
	value!: string;

	@Property({ fieldName: "expiresAt", columnType: "timestamp(6)" })
	expiresAt!: Date;

	@Property({
		fieldName: "createdAt",
		columnType: "timestamp(6)",
		nullable: true,
		defaultRaw: `CURRENT_TIMESTAMP`,
	})
	createdAt?: Date;

	@Property({
		fieldName: "updatedAt",
		columnType: "timestamp(6)",
		nullable: true,
		defaultRaw: `CURRENT_TIMESTAMP`,
	})
	updatedAt?: Date;
}
