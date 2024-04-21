import { check } from "express-validator";

export default {
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
    loginValidation: [
        check("personData").notEmpty().withMessage("email or userName is required"),
        check("password").notEmpty().withMessage("password is required"),
    ],
    loginOtp: [check("otpPersonData").notEmpty().withMessage("email or userName is required")],
    verifyOtp: [check("otpPersonData").notEmpty().withMessage("email or userName is required"), check("otp").notEmpty().withMessage("otp is required")],
    createProduct: [
        check("title").notEmpty().withMessage("tite is required"),
        check("price").notEmpty().withMessage("price is required"),
        check("shortInfo").notEmpty().withMessage("shortInfo is required"),
        check("additionalInfo").notEmpty().withMessage("additionalInfo is required"),
        check("measurement").notEmpty().withMessage("measurement is required"),
    ],

    getAllProducts: [
        // check("page").isNumeric().withMessage("page must be numeric"),
        // check("pageSize").isNumeric().withMessage("pageSize must be numeric"),
        // check("minPrice").isNumeric().withMessage("minPrice must be numeric"),
        // check("maxPrice").isNumeric().withMessage("maxPrice must be numeric"),
    ],
    getProductsByCategory: [
        check("page").isNumeric().withMessage("page must be numeric"),
        check("pageSize").isNumeric().withMessage("pageSize must be numeric"),
    ],
    editProduct: [
        check("title").notEmpty().withMessage("tite is required"),
        check("price").notEmpty().withMessage("price is required"),
        check("shortInfo").notEmpty().withMessage("shortInfo is required"),
        check("additionalInfo").notEmpty().withMessage("additionalInfo is required"),
        check("measurement").notEmpty().withMessage("measurement is required"),
    ],
	createCategory:[
		check("title").notEmpty().withMessage("tite is required")
	],
	editCategory:[
		check("title").notEmpty().withMessage("tite is required")
	],
};
