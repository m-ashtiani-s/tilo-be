const otpModel = require("../../models/otpModel");
const userModel = require("../../models/userModels");


module.exports = class Controller {
	constructor() {
		this.model = { userModel,otpModel };
	}

	showValidationErrors(res,errors) {
		if (!errors.isEmpty()) {
			const errorArray = [];
			for (const error of errors.errors) {
				errorArray.push({
					field: error.path,
					message: error.msg,
				});
			}
			return res.status(500).json({
				data: errorArray,
				success: false,
			});
		}
	}
};
