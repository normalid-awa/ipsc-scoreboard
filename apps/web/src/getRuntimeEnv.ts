import { createServerFn } from "@tanstack/react-start";
import { clientEnvSchema } from "./env";

export const getRuntimeEnv = createServerFn({ method: "GET" }).handler(() => {
	console.error("[getRuntimeEnv]", process.env, import.meta.env);
	return clientEnvSchema.parse({ ...process.env, ...import.meta.env });
});
