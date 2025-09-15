import { Image } from "@/database/entities/image.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { envPlugin } from "@/plugins/env.js";
import { Elysia, file, status, t } from "elysia";
import path from "path";

export const imageRoute = new Elysia({
	prefix: "/image",
})
	.use(envPlugin)
	.use(authPlugin)
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
	.delete(
		"/:id",
		async ({ user, params }) => {
			const image = await orm.em.findOne(Image, { uuid: params.id });
			if (!image) return status(404);
			if (image.uploader.id !== user.id) return status(401);
			await orm.em.remove(image).flush();
			await orm.em.clearCache(`image:${params.id}`);
			return status(204);
		},
		{
			isAuth: true,
			params: t.Object({
				id: t.String({ format: "uuid" }),
			}),
		},
	);
