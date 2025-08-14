import mongoose from "mongoose";
const { Schema } = mongoose;

export const sports = ["IPSC", "Action Air IPSC", "USPSA", "IDPA"] as const;

const shooterProfileSchema = new Schema({
	sport: { type: String, enum: sports, required: true },
	identifier: { type: String, required: true },
	title: String,
	user: { type: Schema.Types.ObjectId, ref: "User" },
	date: { type: Date, default: Date.now },
});

shooterProfileSchema.index(
	{ sports: "text", identifier: "text" },
	{ unique: true },
);
