import { MikroORM } from "@mikro-orm/postgresql";
import ormConfig from "./mikro-orm.config.js";

const orm = await MikroORM.init(ormConfig);
await orm.migrator.up();
export default orm;
