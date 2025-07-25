import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL,
	},
});

export default db;
