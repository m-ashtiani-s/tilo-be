import express from "express";
import validations from "../../../../middleware/validations";
import AuthController from "../../../../controllers/web/v1/authController";
import OtpAuthController from "../../../../controllers/web/v1/otpAuthController";
import ProductController from "../../../../controllers/web/v1/productController";
import adminRouter from "./admin";
import AuthHandler from "../../../../middleware/authHandler";
import AdminAuthHandler from "../../../../middleware/adminAuthHandler";
import LikeController from "../../../../controllers/web/v1/likeController";
import CartController from "../../../../controllers/web/v1/cartController";
import OrderController from "../../../../controllers/web/v1/orderController";

const v1Router = express.Router();

const authController = new AuthController();
const otpAuthController = new OtpAuthController();
const productController1 = new ProductController();
const likeController= new LikeController()
const cartController= new CartController()
const orderController= new OrderController()

v1Router.use("/v1/admin",AuthHandler,AdminAuthHandler, adminRouter);

//auth routs
v1Router.post("/v1/register", validations.registerValidation, authController.register.bind(authController));
v1Router.post("/v1/login", validations.loginValidation, (authController as any).login.bind(authController));
v1Router.post("/v1/login-with-otp", validations.loginOtp, (otpAuthController as any).loginWithOtp.bind(otpAuthController));
v1Router.post("/v1/verify-with-otp", validations.verifyOtp, (otpAuthController as any).verifyOtp.bind(otpAuthController));

//products routs
v1Router.get("/v1/products", validations.getAllProducts, productController1.getAll.bind(productController1));
v1Router.get("/v1/products/:id", validations.getAllProducts, productController1.get.bind(productController1));
v1Router.get("/v1/categories", productController1.getCategoryList.bind(productController1));

v1Router.post("/v1/like",AuthHandler,  likeController.create.bind(likeController));
v1Router.get("/v1/liked-products",AuthHandler,  likeController.get.bind(likeController));

v1Router.post("/v1/cart",AuthHandler,  cartController.create.bind(cartController));
v1Router.get("/v1/cart",AuthHandler,  cartController.get.bind(cartController));
v1Router.delete("/v1/cart/:cart/:product",AuthHandler, cartController.delete.bind(cartController));
v1Router.post("/v1/cart-quantity",AuthHandler,  cartController.editQuantity.bind(cartController));

v1Router.post("/v1/order",AuthHandler,  orderController.create.bind(orderController));
v1Router.get("/v1/order/:id",AuthHandler,  orderController.get.bind(orderController));

export default v1Router;
