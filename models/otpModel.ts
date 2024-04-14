import mongoose, { Model, ObjectId, Schema as _Schema, model } from "mongoose";
const Schema= _Schema;
export interface OTP {
	code: Number;
	expireTime: Date;
	userId: ObjectId;
}

export interface OTPDocument extends OTP, Document {}
const otpSchema = new _Schema(
	{
		code: Number,
		expireTime: {
			type: Date,
			required: true,
		},
		userId: {type: Schema.Types.ObjectId,ref: 'user'},
        
	},
	{ timestamps: true }
);

const otpModel: Model<OTPDocument> = mongoose.model<OTPDocument>("otp", otpSchema);

export default otpModel;
