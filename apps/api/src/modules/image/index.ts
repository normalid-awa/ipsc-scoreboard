import { Image } from "@/database/entities/image.entity.js";
import orm from "@/database/orm.js";
import { authPlugin } from "@/plugins/auth.js";
import { envPlugin } from "@/plugins/env.js";
import { Elysia, file, status, t } from "elysia";
import { mkdir, rename, rm, stat } from "fs/promises";
import crypto from "crypto";
import path from "path";
import { createWriteStream } from "fs";
import { rel } from "@mikro-orm/core";
import { User } from "@/database/entities/user.entity.js";

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
	.post(
		"/",
		async ({ env, user, body }) => {
			let tempFilePath = path.join(
				env.FILE_UPLOAD_PATH,
				`${Math.random().toString(36).substring(2, 15)}`,
			);

			try {
				await stat(path.dirname(tempFilePath));
			} catch (e) {
				await mkdir(path.dirname(tempFilePath), { recursive: true });
			}

			try {
				const hash = crypto.createHash("sha256");
				const writeStream = createWriteStream(tempFilePath);
				for await (const chunk of body.file.stream().values()) {
					const data = Buffer.from(chunk);
					writeStream.write(data);
					hash.update(data);
				}
				writeStream.end();
				writeStream.close();
				const hashValue = hash.digest("hex");

				const filePath = path.join(env.FILE_UPLOAD_PATH, hashValue);

				try {
					await stat(filePath);
					console.log(`${hashValue} File already exists`);
					await rm(tempFilePath);
				} catch (e) {
					await rename(tempFilePath, filePath);
				}

				const image = new Image();
				image.filename = body.file.name;
				image.mimetype = body.file.type;
				image.size = body.file.size;
				image.hash = hashValue;
				image.uploader = rel(User, user.id);

				await orm.em.persist(image).flush();
				return image;
			} catch (e) {
				console.error(e);
				await rm(tempFilePath);
				return status(500);
			}
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
