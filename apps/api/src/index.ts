import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import orm from "./database/orm.js";
import { RequestContext, Utils, wrap } from "@mikro-orm/core";

const app = new Elysia({ adapter: node() })
	.decorate("orm", orm)
	.on("beforeHandle", () => RequestContext.enter(orm.em))
	.on("afterHandle", ({ response }) =>
		Utils.isEntity(response) ? wrap(response).toObject() : response,
	)
	.listen(3000, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
