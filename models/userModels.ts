import mongoose, { Document, Model, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
	name: string;
	email: string;
	userName: string;
	role: string;
	password: string;
	profilePic?: string;
}

export interface UserDocument extends User, Document {}

const userSchema = new mongoose.Schema(
	{
		name: String,
		email: {
			type: String,
			unique: true,
			required: true,
		},
		userName: {
			type: String,
			unique: true,
			required: true,
		},
		role: {
			type: String,
			required: true,
			default: "USER",
		},
		password: String,
		profilePic: String,
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	const password = this.password as string;
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			return next(err);
		}
		this.password = hash;
		next();
	});
});

const userModel: Model<UserDocument> = mongoose.model<UserDocument>("user", userSchema);


export default userModel;
