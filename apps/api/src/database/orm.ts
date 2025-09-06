import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-orm.config.js";

const orm = await MikroORM.init(mikroOrmConfig);
await orm.migrator.up();
export default orm;
