import express from "express";
import validations from "../../../../middleware/validations";
import AuthController from "../../../../controllers/web/v1/authController";
import OtpAuthController from "../../../../controllers/web/v1/otpAuthController";
import ProductController from "../../../../controllers/web/v1/admin/productController";
import ProductController1 from "../../../../controllers/web/v1/productController";

const v1Router = express.Router();

const authController = new AuthController();
const otpAuthController = new OtpAuthController();
const productController = new ProductController();
const productController1 = new ProductController1();

v1Router.post("/v1/register", validations.registerValidation, authController.register.bind(authController));
v1Router.post("/v1/login", validations.loginValidation, (authController as any).login.bind(authController));
v1Router.post("/v1/login-with-otp", validations.loginOtp, (otpAuthController as any).loginWithOtp.bind(otpAuthController));
v1Router.post("/v1/verify-with-otp", validations.verifyOtp, (otpAuthController as any).verifyOtp.bind(otpAuthController));
v1Router.post("/v1/product",  productController.create.bind(productController));
v1Router.get("/v1/products",  productController.getAll.bind(productController));
v1Router.get("/v1/products1",  productController1.getAll.bind(productController1));
v1Router.delete("/v1/products/:id",  productController.delete.bind(productController));
v1Router.put("/v1/products/:id",  productController.edit.bind(productController));
v1Router.get("/v1/products/:id",  productController.get.bind(productController));

export default v1Router;
