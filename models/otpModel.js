const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const otpSchema = new mongoose.Schema(
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

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel;
