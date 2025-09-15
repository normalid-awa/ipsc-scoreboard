import { Image } from "@/database/entities/image.entity.js";
import { envPlugin } from "@/plugins/env.js";
import { ormPlugin } from "@/plugins/orm.js";
import { Elysia, file, status, t } from "elysia";
import path from "path";

export const imageRoute = new Elysia({
	prefix: "/image",
})
	.use(envPlugin)
	.use(ormPlugin)
	.get(
		"/:id",
		async ({ orm, params, env, set }) => {
			const res = await orm.em.findOne(Image, { uuid: params.id });
			if (!res) return status(404);

			set.headers["pragma"] = "public";
			set.headers["content-disposition"] =
				`inline; filename="${res.filename}"`;
			set.headers["content-type"] = res.mimetype;
			set.headers["content-length"] = res.size;

			return file(path.join(env.FILE_UPLOAD_PATH, res.hash));
		},
		{
			params: t.Object({
				id: t.String({ format: "uuid" }),
			}),
		},
	);
