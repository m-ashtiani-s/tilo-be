const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
	bcrypt.hash(this.password, 10, (err, hash) => {
		this.password = hash;
		next();
	});
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
