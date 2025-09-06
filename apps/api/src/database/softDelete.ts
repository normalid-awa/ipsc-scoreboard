import { Property } from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";

@SoftDeletable(() => SoftDeletableEntity, "deletedAt", () => new Date())
export abstract class SoftDeletableEntity {
	@Property()
	deletedAt?: Date;
}
