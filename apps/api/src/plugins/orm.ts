import orm from "@/database/orm.js";
import { Elysia } from "elysia";

export const ormPlugin = new Elysia({ name: "orm" }).decorate("orm", orm);
