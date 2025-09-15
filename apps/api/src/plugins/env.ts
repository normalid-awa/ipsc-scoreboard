import env from "@/env.js";
import { Elysia } from "elysia";

export const envPlugin = new Elysia({ name: "env" }).decorate("env", env);
