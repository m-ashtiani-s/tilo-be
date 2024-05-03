import { validationResult } from "express-validator";
import Controller from "../controller";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import passport, { use, authenticate } from "passport";
import { Request, Response } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import { UserDocument } from "../../../models/userModels";

export default class AuthController extends Controller {
	register(req: Request, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		this.model.userModel
			.findOne({ email: req.body.email })
			.then((user) => {
				if (user) {
					return res.status(400).json({
						fields: "register",
						success: false,
						data: null,
						message: "email is existed",
					});
				}
				this.model.userModel
					.findOne({ userName: req.body.userName })
					.then((user) => {
						if (user) {
							return res.status(400).json({
								fields: "register",
								success: false,
								data: null,
								message: "userName is existed",
							});
						}

						const newUser = new this.model.userModel({
							userName: req.body.userName,
							name: req.body.name,
							email: req.body.email,
							password: req.body.password,
						});

						const likeModel = new this.model.likeModel({
							user: newUser._id,
						});
						const cartModel = new this.model.cartModel({
							user: newUser._id,
							products: [],
							cartSum: 0,
							cartSumWithDiscount: 0,
						});

						newUser.save();
						likeModel.save();
						cartModel.save();
						return res.json({
							fields: "register",
							success: true,
							data: null,
							message: "user created successfully",
						});
					})
					.catch((err: Error) => {
						return res.status(500).json({
							fields: "register",
							success: false,
							data: null,
							message: err.message,
						});
					});
			})
			.catch((err: Error) => {
				return res.status(500).json({
					fields: "register",
					success: false,
					data: null,
					message: err.message,
				});
			});
	}

	login(req: Request, res: Response) {
		console.log(req)
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		// Saving reference to 'this' to use inside LocalStrategy
		const self = this;

		//handle login with email or username (username dont have dot)
		if (req.body.personData.includes(".")) {
			passport.use(
				new LocalStrategy({ usernameField: "personData" }, function (email, password, done) {
					self.model.userModel
						.findOne({ email: email })
						.then((user: UserDocument | null) => {
							if (!user) {
								return res.status(401).json({
									fields: "login",
									success: false,
									data: null,
									message: "login data isn't correct",
									code:401
								});
							}

							compare(password, user.password, function (err, isMatch) {
								if (err) {
									return res.status(401).json({
										fields: "login",
										success: false,
										data: null,
										message: err.message,
										code:401
									});
								}
								if (!isMatch) {
									return res.status(401).json({
										fields: "register",
										success: false,
										data: null,
										message: "login data isn't correct",
										code:401
									});
								}

								return done(null, user);
							});
						})
						.catch((err: Error) => {
							return res.status(401).json({
								fields: "login",
								success: false,
								data: null,
								message: err.message,
								code:401
							});
						});
				})
			);
		} else {
			passport.use(
				new LocalStrategy({ usernameField: "personData" }, function (username, password, done) {
					self.model.userModel
						.findOne({ userName: username })
						.then((user: UserDocument | null) => {
							if (!user) {
								return res.status(401).json({
									fields: "login",
									success: false,
									data: null,
									message: "login data isn't correct",
									code:401
								});
							}
							compare(password, user.password, function (err, isMatch) {
								if (err) {
									return res.status(401).json({
										fields: "login",
										success: false,
										data: null,
										message: err.message,
										code:401
									});
								}
								if (!isMatch) {
									return res.status(401).json({
										fields: "login",
										success: false,
										data: null,
										message: "login data isn't correct",
										code:401
									});
								}

								return done(null, user);
							});
						})
						.catch((err: Error) => {
							return res.status(401).json({
								fields: "login",
								success: false,
								data: null,
								message: err.message,
								code:401
							});
						});
				})
			);
		}

		passport.authenticate("local", function (err: Error, user: UserDocument) {
			if (err) {
				return res.status(401).json({
					fields: "login",
					success: false,
					data: null,
					message: err.message,
					code:401
				});
			}
			if (!user) {
				return res.status(401).json({
					fields: "login",
					success: false,
					data: null,
					message: "login data isn't correct",
					code:401
				});
			}

			const tokenData = {
				user_id: user._id,
				email: user.email,
				role: user.role,
			};
			if (!process.env.SECRET_KEY) {
				throw new Error("SECRET_KEY is not defined in environment variables.");
			}
			const token = sign(tokenData, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 8 });

			const tokenOption = {
				httpOnly: true,
				secure: true,
			};
			res.cookie("token", token, tokenOption);
			return res.status(200).json({
				message: "Login successfully",
				data: { user, token },
				success: true,
				error: false,
			});
		})(req, res);
	}
}
