import { drizzle } from "drizzle-orm/node-postgres";

// const db = drizzle({
// 	connection: {
// 		connectionString: process.env.DATABASE_URL,
// 	},
// });

// export default db;

import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.DATABASE_URL as string);
}
