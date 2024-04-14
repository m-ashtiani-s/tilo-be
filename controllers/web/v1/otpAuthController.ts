import { validationResult } from "express-validator";
import Controller from "../controller";
import jwt from "jsonwebtoken";
import {Request, Response} from 'express';


export default class OtpAuthController extends Controller {
	loginWithOtp(req:Request, res:Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		if (req.body.otpPersonData.includes(".")) {
			this.model.userModel
				.findOne({ email: req.body.otpPersonData })
				.then((user) => {
					if (!user) {
						return res.status(400).json({ data: [{ fields: "user", message: "email not found!" }], success: false });
					}

					this.model.otpModel.findOne({ userId: user._id }).then((otp) => {
						const otpCode = this.generateOtp(); //TODO
						const now = new Date();
						const exCode = new Date(now.getTime() + 2 * 60000);
						if (otp) {
							if (otp.expireTime > now) {
								return res.status(500).json({
									message: "otp sent in last 2 minute, please try again later",
									data: null,
									success: true,
									error: false,
								});
							}

							return otp
								.updateOne({
									code: otpCode,
									expireTime: exCode,
									userId: user._id,
								})
								.then(() => {
									return res.status(200).json({
										message: "otp code updated and sent",
										data: { otp: otpCode },
										success: true,
										error: false,
									});
								})
								.catch((err) => {
									return res.status(500).json({ data: [{ fields: "otp", message: err.message }], success: false });
								});
						}

						const newOtp = new this.model.otpModel({
							code: otpCode,
							expireTime: exCode,
							userId: user._id,
						});

						newOtp.save();
						return res.status(200).json({
							message: "otp code sent",
							data: { otp: otpCode },
							success: true,
							error: false,
						});
					});
				})
				.catch((err) => {
					return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
				});
		} else {
			this.model.userModel
				.findOne({ userName: req.body.otpPersonData })
				.then((user) => {
					if (!user) {
						return res.status(400).json({ data: [{ fields: "user", message: "userName not found!" }], success: false });
					}

					this.model.otpModel.findOne({ userId: user._id }).then((otp) => {
						const otpCode = this.generateOtp();
						const now = new Date();
						const exCode = new Date(now.getTime() + 2 * 60000);
						if (otp) {
							if (otp.expireTime > now) {
								return res.status(500).json({
									message: "otp sent in last 2 minute, please try again later",
									data: null,
									success: true,
									error: false,
								});
							}

							otp.updateOne({
								code: otpCode,
								expireTime: exCode,
								userId: user._id,
							});
							return res.status(200).json({
								message: "otp code sent",
								data: { otp: otpCode },
								success: true,
								error: false,
							});
						}

						const newOtp = new this.model.otpModel({
							code: otpCode,
							expireTime: exCode,
							userId: user._id,
						});

						newOtp.save();
						return res.status(200).json({
							message: "otp code sent",
							data: { otp: otpCode },
							success: true,
							error: false,
						});
					});
				})
				.catch((err) => {
					return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
				});
		}
	}

	verifyOtp(req:Request, res:Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		if (req.body.otpPersonData.includes(".")) {
			this.model.userModel
				.findOne({ email: req.body.otpPersonData })
				.then((user) => {
					if (!user) {
						return res.status(400).json({ data: [{ fields: "user", message: "userName not found!" }], success: false });
					}

					this.model.otpModel.findOne({ userId: user._id }).then((otp) => {

                        if (!otp) {
                            return res.status(400).json({ data: [{ fields: "user", message: "otp dont sent to your email" }], success: false });
                        }

						if (req.body.otp != otp.code) {
							return res.status(400).json({ data: [{ fields: "otp", message: "otp code is false!" }], success: false });
						}

						if (!process.env.SECRET_KEY) {
							throw new Error("SECRET_KEY is not defined in environment variables.");
						}

						const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
							expiresIn: "110h",
						});

						otp.deleteOne()
							.then(() => {
								return res.status(201).json({
									data: { user, token },
									success: true,
								});
							})
							.catch((err) => {
								return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
							});
					});
				})
				.catch((err) => {
					return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
				});
		} else {
		}
	}
};
