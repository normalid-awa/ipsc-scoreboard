import { Image } from "@/database/entities/image.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { Elysia, status, t } from "elysia";
import { rel } from "@mikro-orm/core";
import { User } from "@/database/entities/user.entity.js";

export const imageRoute = new Elysia({
	prefix: "/image",
})
	.use(authPlugin)
	.get(
		"/:id",
		async ({ params, set }) => {
			const image = await orm.em
				.findOne(Image, { uuid: params.id })
				.then((v) => v?.getImage());
			if (!image) return status(404);
			set.headers = { ...set.headers, ...image[1] };
			return image[0];
		},
		{
			params: t.Object({
				id: t.String({ format: "uuid" }),
			}),
		},
	)
	.post(
		"/",
		async ({ user, body }) => {
			const image = new Image();
			await image.upload(body.file, rel(User, user.id));
			await orm.em.persist(image).flush();
			return image;
		},
		{
			requiredAuth: true,
			body: t.Object({
				file: t.File({
					type: "image/*",
				}),
			}),
		},
	)
	.delete(
		"/:id",
		async ({ user, params }) => {
			const image = await orm.em.findOne(Image, { uuid: params.id });
			if (!image) return status(404);
			if (image.uploader.id !== user.id) return status(401);
			orm.em.remove(image).flush();
			return status(204);
		},
		{
			requiredAuth: true,
			params: t.Object({
				id: t.String({ format: "uuid" }),
			}),
		},
	);
