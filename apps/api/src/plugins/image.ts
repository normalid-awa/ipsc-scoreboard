import { Elysia, status } from "elysia";
import path from "path";
import { mkdir, rename, rm, stat } from "fs/promises";
import crypto from "crypto";
import { createWriteStream } from "fs";
import env from "@/env.js";
import { Image } from "@/database/entities/image.entity.js";
import { rel } from "@mikro-orm/core";
import orm from "@/database/orm.js";
import { User } from "@/database/entities/user.entity.js";

export const imagePlugin = new Elysia().decorate("image", {
	async storeImage(file: File, uploader: string) {
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
			for await (const chunk of file.stream().values()) {
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

			try {
				const image = new Image();
				image.filename = file.name;
				image.mimetype = file.type;
				image.size = file.size;
				image.hash = hashValue;
				image.uploader = rel(User, uploader);

				await orm.em.persist(image).flush();
				return image;
			} catch (e) {
				console.error(e);
				await rm(filePath);
				throw e;
			}
		} catch (e) {
			console.error(e);
			await rm(tempFilePath);
			throw e;
		}
	},
	async deleteImage(imageId: string, userId: string) {
		const image = await orm.em.findOne(Image, { uuid: imageId });
		if (!image) return status(404);
		if (image.uploader.id !== userId) return status(401);
		await orm.em.remove(image).flush();
		await orm.em.clearCache(`image:${imageId}`);
		if ((await orm.em.count(Image, { hash: image.hash })) === 0) {
			await rm(path.join(env.FILE_UPLOAD_PATH, image.hash));
		}
		return status(204);
	},
});
