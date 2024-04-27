import { validationResult } from "express-validator";
import Controller from "../controller";
import { Request, Response } from "express";
import Transform from "../../../transform/web/v1/transform";

export default class CartController extends Controller {
    async create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }
        //@ts-ignore
        const cart = await this.model.cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(400).json({
                fields: "cart",
                success: false,
                data: null,
                message: "cart with this user not found",
            });
        }

        const existingProduct = cart?.products?.findIndex((obj) => obj?.productId?.toString() == req.body.productId);
        const product = await this.model.productModel.findById(req?.body.productId);
        if (!product) {
            return res.status(500).json({
                fields: "product",
                success: false,
                data: null,
                message: "product not found",
            });
        }

        if (existingProduct === -1) {
            const productInCart = {
                productId: req?.body.productId,
                quantity: req?.body.quantity,
            };
            cart.products.push(productInCart);
            cart.cartSum = cart.cartSum + product?.price;
            cart.cartSumWithDiscount = cart.cartSumWithDiscount + product?.priceWithDiscount;

            cart.save();
            return res.status(200).json({
                fields: "cart",
                success: true,
                data: null,
                message: "successfully added",
            });
        } else {
            let newCart = [...cart?.products];
            newCart[existingProduct].quantity = newCart[existingProduct]?.quantity + req.body.quantity;
            //@ts-ignore
            cart?.products = newCart;
            cart.cartSum = cart.cartSum + product?.price;
            cart.cartSumWithDiscount = cart.cartSumWithDiscount + product?.priceWithDiscount;
            cart.save();
            return res.status(200).json({
                fields: "cart",
                success: true,
                data: null,
                message: "successfully added",
            });
        }
    }

    async get(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        //@ts-ignore
        const cart = await this.model.cartModel.findOne({ user: req.user._id }).populate("products.productId").exec();
        if (!cart) {
            return res.status(400).json({
                fields: "cart",
                success: false,
                data: null,
                message: "cart with this user not found",
            });
        }

        return res.status(200).json({
            fields: "cart",
            success: true,
            data: new Transform().cart(cart),
            message: "success",
        });
    }

    async delete(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        //@ts-ignore
        const cart = await this.model.cartModel.findById(req.params.cart);
        if (!cart) {
            return res.status(400).json({
                fields: "cart",
                success: false,
                data: null,
                message: "cart not found",
            });
        }

        const productsInCart = [...cart.products];
        const existingProduct = productsInCart?.findIndex((obj) => obj?.productId?.toString() == req.params.product);
        if (existingProduct === -1) {
            return res.status(400).json({
                fields: "cart",
                success: false,
                data: null,
                message: "product not found in cart",
            });
        }
        const filteredProducts = productsInCart.filter((product) => product.productId.toString() !== req.params.product);
        cart.products = filteredProducts;
        cart.save();
        return res.status(200).json({
            fields: "cart",
            success: true,
            data: null,
            message: "deleted successfully",
        });
    }
}
