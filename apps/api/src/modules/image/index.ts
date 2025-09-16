import { Image } from "@/database/entities/image.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { envPlugin } from "@/plugins/env.js";
import { Elysia, file, status, t } from "elysia";
import path from "path";
import { imagePlugin } from "@/plugins/image.js";

export const imageRoute = new Elysia({
	prefix: "/image",
})
	.use(envPlugin)
	.use(authPlugin)
	.use(imagePlugin)
	.get(
		"/:id",
		async ({ params, env, set }) => {
			const res = await orm.em.findOne(
				Image,
				{ uuid: params.id },
				{
					cache: [`image:${params.id}`, 60e3 * 5 /* 5 minutes */],
				},
			);
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
	)
	.post(
		"/",
		async ({ user, body, image }) => {
			return await image.storeImage(body.file, user.id);
		},
		{
			isAuth: true,
			body: t.Object({
				file: t.File({
					type: "image",
				}),
			}),
		},
	)
	.delete(
		"/:id",
		async ({ user, params, image }) => {
			return await image.deleteImage(params.id, user.id);
		},
		{
			isAuth: true,
			params: t.Object({
				id: t.String({ format: "uuid" }),
			}),
		},
	);
