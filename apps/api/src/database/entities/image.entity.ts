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
import { rm } from "node:fs/promises";
import env from "../../env.js";
import crypto from "node:crypto";
import { existsSync, mkdirSync, writeFile } from "node:fs";
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

	private writeBuffer?: Buffer;

	async upload(file: File, uploader: User) {
		const hash = crypto.createHash("sha256");

		for await (const chunk of file.stream().values()) {
			const data = Buffer.from(chunk);
			if (this.writeBuffer)
				this.writeBuffer = Buffer.concat([this.writeBuffer, data]);
			else this.writeBuffer = data;
			hash.update(data);
		}

		const hashValue = hash.digest("hex");

		console.debug(`File ${hashValue} (${file.size}B) has been uploaded`);

		this.filename = file.name;
		this.mimetype = file.type;
		this.size = file.size;
		this.hash = hashValue;
		this.uploader = uploader;
	}

	async getImage(): Promise<[File, HTTPHeaders] | undefined> {
		const headers: HTTPHeaders = {};

		headers.pragma = "public";
		headers["content-disposition"] =
			`inline; filename="${encodeURIComponent(this.filename)}"`;
		headers["content-type"] = this.mimetype;
		headers["content-length"] = String(this.size);
		headers["cache-control"] =
			`public, max-age=${60 * 60 * 5 /** 5 miniutes */}`;
		headers["etag"] = this.hash;

		const path = join(
			env.FILE_UPLOAD_PATH,
			this.hash.slice(0, 2),
			this.hash,
		);
		if (existsSync(path)) {
			const imageFile = file(path);
			//TODO: the bug of https://github.com/elysiajs/elysia/issues/1299
			return [imageFile.value as File, headers];
		}
		return;
	}

	async saveBufferToDisk() {
		const filePath = join(
			env.FILE_UPLOAD_PATH,
			this.hash.slice(0, 2),
			this.hash,
		);

		try {
			if (!existsSync(dirname(filePath)))
				mkdirSync(dirname(filePath), { recursive: true });
			if (!existsSync(filePath)) {
				console.debug(
					`Writing file ${filePath} with size of array buffer ${this.writeBuffer?.byteLength}B`,
				);
				writeFile(filePath, this.writeBuffer!, (err) => {
					if (err) throw err;
				});
			}
		} catch (e) {
			throw e;
		} finally {
			delete this.writeBuffer;
		}
	}

	@AfterCreate()
	protected async onAfterCreate(args: EventArgs<this>) {
		try {
			this.saveBufferToDisk();
		} catch (e) {
			args.em.rollback();
			console.error(e);
			throw e;
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
