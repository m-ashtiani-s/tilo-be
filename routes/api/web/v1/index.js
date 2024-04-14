const express = require("express");
const authController = require("../../../../controllers/web/v1/authController");
const validations = require("../../../../middleware/validations");
const v1Router = express.Router()

v1Router.post('/v1/register',validations.registerValidation,authController.register.bind(authController))
v1Router.post('/v1/login',validations.loginValidation,authController.login.bind(authController))
v1Router.post('/v1/login-with-otp',validations.loginOtp,authController.loginWithOtp.bind(authController))
// v1Router.post('/v1/verify-with-otp',validations.verifyValidation,authController.verifyWithOtp.bind(authController))

module.exports = v1Router
