import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema",
	out: "./src/db/schema/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
