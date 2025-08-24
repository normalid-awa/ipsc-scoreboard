import { Config } from "./config.type.js";

const config: Config = {
	database: {
		connectionString: process.env.DATABASE_URL!,
	},
};

export default config;
