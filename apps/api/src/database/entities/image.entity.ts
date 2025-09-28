import {
	AfterCreate,
	BeforeDelete,
	Entity,
	type EventArgs,
	ManyToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";
import { dirname, join } from "node:path";
import { rm, stat } from "node:fs/promises";
import env from "@/env.js";
import crypto from "node:crypto";
import { Writable } from "node:stream";
import { createWriteStream, mkdirSync } from "node:fs";
import { file, HTTPHeaders } from "elysia";

@Entity()
export class Image {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	uuid!: string;

	@Property()
	filename!: string;

	@Property()
	mimetype!: string;

	@Property()
	size!: number;

	@Property()
	hash!: string;

	@ManyToOne()
	uploader!: User;

	private writeStream?: Writable;

	async upload(file: File, uploader: User) {
		const hash = crypto.createHash("sha256");
		this.writeStream = new Writable();

		for await (const chunk of file.stream().values()) {
			const data = Buffer.from(chunk);
			this.writeStream.write(data);
			hash.update(data);
		}
		this.writeStream.end();

		const hashValue = hash.digest("hex");

		try {
			this.filename = file.name;
			this.mimetype = file.type;
			this.size = file.size;
			this.hash = hashValue;
			this.uploader = uploader;
		} catch (e) {}
	}

	async getImage(): Promise<[File, HTTPHeaders] | undefined> {
		const headers: HTTPHeaders = {};

		headers.pragma = "public";
		headers["content-disposition"] =
			`inline; filename="${encodeURIComponent(this.filename)}"`;
		headers["content-type"] = this.mimetype;
		headers["content-length"] = String(this.size);

		try {
			await stat(
				join(env.FILE_UPLOAD_PATH, this.hash.slice(0, 2), this.hash),
			);
			const imageFile = file(
				join(env.FILE_UPLOAD_PATH, this.hash.slice(0, 2), this.hash),
			);
			//TODO: the bug of https://github.com/elysiajs/elysia/issues/1299
			return [imageFile.value as File, headers];
		} catch (e) {
			console.error(e);
			return;
		}
	}

	@AfterCreate()
	protected async onAfterCreate(args: EventArgs<this>) {
		const filePath = join(
			env.FILE_UPLOAD_PATH,
			args.entity.hash.slice(0, 2),
			args.entity.hash,
		);
		try {
			try {
				await stat(dirname(filePath));
			} catch (e) {
				console.log(`Creating directory ${dirname(filePath)}`);
				mkdirSync(dirname(filePath), { recursive: true });
			}
			await stat(filePath);
			console.log(`${this.hash} File already exists`);
		} catch (e) {
			try {
				this.writeStream?.pipe(createWriteStream(filePath));
			} catch (e_w) {
				console.error(e);
				await rm(filePath);
				throw e;
			}
		} finally {
			this.writeStream?.destroy();
			delete this.writeStream;
		}
	}

	@BeforeDelete()
	protected async onDelete(arg: EventArgs<this>) {
		if (
			(await arg.em.count(Image, {
				hash: arg.entity.hash,
				uuid: { $ne: arg.entity.uuid },
			})) !== 0
		)
			return;

		const filePath = join(
			env.FILE_UPLOAD_PATH,
			arg.entity.hash.slice(0, 2),
			arg.entity.hash,
		);
		try {
			await rm(filePath);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
