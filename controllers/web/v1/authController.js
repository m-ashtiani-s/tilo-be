const { validationResult } = require("express-validator");
const Controller = require("../controller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new (class AuthController extends Controller {
	register(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}
		this.model.userModel
			.findOne({ email: req.body.email })
			.then((user) => {
				if (user) {
					return res.status(400).json({ data: [{ fields: "email", message: "email is existed" }], success: false });
				}
				this.model.userModel
					.findOne({ userName: req.body.userName })
					.then((user) => {
						if (user) {
							return res.status(400).json({ data: [{ fields: "userName", message: "userName is existed" }], success: false });
						}

						const newUser = new this.model.userModel({
							userName: req.body.userName,
							name: req.body.name,
							email: req.body.email,
							password: req.body.password,
						});

						newUser.save();
						res.json({ data: [{ fields: "user", message: "user created successfully" }], success: true });
					})
					.catch((err) => {
						res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
					});
			})
			.catch((err) => {
				res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
			});
	}

	login(req, res, next) {
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
						.then((user) => {
							if (!user) {
								return res.status(400).json({ data: [{ fields: "user", message: "login data isn't correct" }], success: false });
							}
							bcrypt.compare(password, user.password, function (err, isMatch) {
								if (err) {
									return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
								}
								if (!isMatch) {
									return res.status(400).json({ data: [{ fields: "user", message: "login data isn't correct" }], success: false });
								}
								return done(null, user);
							});
						})
						.catch((err) => {
							return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
						});
				})
			);
		} else {
			passport.use(
				new LocalStrategy({ usernameField: "personData" }, function (username, password, done) {
					self.model.userModel
						.findOne({ userName: username })
						.then((user) => {
							if (!user) {
								return res.status(400).json({ data: [{ fields: "userName", message: "login data isn't correct" }], success: false });
							}
							bcrypt.compare(password, user.password, function (err, isMatch) {
								if (err) {
									return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
								}
								if (!isMatch) {
									return res
										.status(400)
										.json({ data: [{ fields: "userName", message: "login data isn't correct" }], success: false });
								}
								return done(null, user);
							});
						})
						.catch((err) => {
							return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
						});
				})
			);
		}

		passport.authenticate("local", function (err, user) {
			if (err) {
				return res.status(500).json({ data: [{ fields: "user", message: err.message }], success: false });
			}
			if (!user) {
				return res.status(400).json({ data: [{ fields: "user", message: "login data isn't correct" }], success: false });
			}

			const tokenData = {
				_id: user._id,
				email: user.email,
			};
			const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 8 });

			const tokenOption = {
				httpOnly: true,
				secure: true,
			};
			res.cookie("token", token, tokenOption);
			return res.status(200).json({
				message: "Login successfully",
				data: { user },
				success: true,
				error: false,
			});
		})(req, res, next);
	}
	loginWithOtp(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res, errors);
		}

		// Saving reference to 'this' to use inside LocalStrategy
		const self = this;

		//handle login with email or username (username dont have dot)
		if (req.body.otpPersonData.includes(".")) {
			this.model.userModel
				.findOne({ email: req.body.otpPersonData })
				.then((user) => {
					if (!user) {
						return res.status(400).json({ data: [{ fields: "user", message: "email not found!" }], success: false });
					}

					this.model.otpModel.findOne({ userId: user._id }).then((otp) => {
						const otpCode = 52635; //TODO
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
								message: "otp code sent user",
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
		} else {
			this.model.userModel
				.findOne({ userName: req.body.otpPersonData })
				.then((user) => {
					if (!user) {
						return res.status(400).json({ data: [{ fields: "user", message: "userName not found!" }], success: false });
					}

					this.model.otpModel.findOne({ userId: user._id }).then((otp) => {
						const otpCode = 52635; //TODO
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
})();
