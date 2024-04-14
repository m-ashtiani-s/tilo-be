const { check } = require("express-validator");

module.exports = {
	registerValidation: [
		check("userName").notEmpty().withMessage("userName is required"),
		check("email").notEmpty().withMessage("email is required").isEmail().withMessage("email format is not true"),
		check("password")
			.notEmpty()
			.withMessage("password is required")
			.isLength({ min: 8 })
			.withMessage("password must more than 8 character")
			.matches(/[a-z]/)
			.withMessage("password must contain small letters")
			.matches(/[A-Z]/)
			.withMessage("password must contain capital letters")
			.matches(/[0-9]/)
			.withMessage("password must contain numbers")
			.matches(/[!@#$%^&*(),.?":{}|<>]/)
			.withMessage("password must contain special character"),
	],
	loginValidation: [check("personData").notEmpty().withMessage("email or userName is required"), check("password").notEmpty().withMessage("password is required")],
	loginOtp: [check("otpPersonData").notEmpty().withMessage("email or userName is required")],
};
