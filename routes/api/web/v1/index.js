const express = require("express");
const authController = require("../../../../controllers/web/v1/authController");
const validations = require("../../../../middleware/validations");
const otpAuthController = require("../../../../controllers/web/v1/otpAuthController");
const v1Router = express.Router()

v1Router.post('/v1/register',validations.registerValidation,authController.register.bind(authController))
v1Router.post('/v1/login',validations.loginValidation,authController.login.bind(authController))
v1Router.post('/v1/login-with-otp',validations.loginOtp,otpAuthController.loginWithOtp.bind(otpAuthController))
v1Router.post('/v1/verify-with-otp',validations.verifyOtp,otpAuthController.verifyOtp.bind(otpAuthController))

module.exports = v1Router
