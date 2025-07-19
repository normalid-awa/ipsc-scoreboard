import { timestamp } from "drizzle-orm/pg-core";

export const timestampedEntity = {
	updatedAt: timestamp(),
	createdAt: timestamp().defaultNow().notNull(),
};
