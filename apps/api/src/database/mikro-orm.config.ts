import { defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Migrator } from "@mikro-orm/migrations";
import "dotenv/config";
import env from "../env.js";

export default defineConfig({
	clientUrl: env.DATABASE_URL,
	entities: ["dist/**/*.entity.js"],
	entitiesTs: ["src/**/*.entity.ts"],
	migrations: {
		path: "dist/database/migrations",
		pathTs: "src/database/migrations",
	},
	metadataProvider: TsMorphMetadataProvider,
	debug: process.env.NODE_ENV === "development",
	extensions: [Migrator],
});
