import express from "express";
import validations from "../../../../middleware/validations";
import AuthController from "../../../../controllers/web/v1/authController";
import OtpAuthController from "../../../../controllers/web/v1/otpAuthController";

const v1Router = express.Router();

const authController = new AuthController();
const otpAuthController = new OtpAuthController();

v1Router.post("/v1/register", validations.registerValidation, authController.register.bind(authController));
v1Router.post("/v1/login", validations.loginValidation, (authController as any).login.bind(authController));
v1Router.post("/v1/login-with-otp", validations.loginOtp, (otpAuthController as any).loginWithOtp.bind(otpAuthController));
v1Router.post("/v1/verify-with-otp", validations.verifyOtp, (otpAuthController as any).verifyOtp.bind(otpAuthController));

export default v1Router;
