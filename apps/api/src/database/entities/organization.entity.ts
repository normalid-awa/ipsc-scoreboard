import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Organization {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@Property({ type: "text" })
	name!: string;

	@Property({ type: "text", unique: "organization_slug_key" })
	slug!: string;

	@Property({ type: "text", nullable: true })
	logo?: string;

	@Property({ fieldName: "createdAt", columnType: "timestamp(6)" })
	createdAt!: Date;

	@Property({ type: "text", nullable: true })
	metadata?: string;
}
