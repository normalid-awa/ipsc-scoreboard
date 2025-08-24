import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import appConfig from "../config.js";
import { Migrator } from "@mikro-orm/migrations";
import { EntityGenerator } from "@mikro-orm/entity-generator";

const ormConfig: Options = {
	driver: PostgreSqlDriver,
	clientUrl: appConfig.database.connectionString,
	entities: ["dist/database/entities/**/*.js"],
	entitiesTs: ["src/database/entities/**/*.ts"],
	migrations: {
		path: "dist/database/migrations",
		pathTs: "src/database/migrations",
	},
	metadataProvider: TsMorphMetadataProvider,
	debug: process.env.NODE_ENV === "development",
	extensions: [Migrator, EntityGenerator],
	allowGlobalContext: true,
};

export default ormConfig;
