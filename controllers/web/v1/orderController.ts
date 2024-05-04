import { validationResult } from "express-validator";
import Controller from "../controller";
import { Request, Response } from "express";
import Transform from "../../../transform/web/v1/transform";

export default class OrderController extends Controller {
	async create(req: Request, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return this.showValidationErrors(res as Response, errors);
		}
		try {
			const cart = await this.model.cartModel.findById(req.body.cartId);
			if (!cart) {
				return res.status(400).json({
					fields: "cart",
					success: false,
					data: null,
					message: "cart with this user not found",
				});
			}
			const newOrder = new this.model.orderModel({
				//@ts-ignore
				user: req?.user?._id,
				products: cart?.products,
				orderSum: cart.cartSum,
				orderSumWithDiscount: cart.cartSumWithDiscount,

				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phoneNumber: req.body.phoneNumber,
				email: req.body.email,
				streetAddress: req.body.streetAddress,
				country: req.body.country,
				townCity: req.body.townCity,
				state: req.body.state,
				zipCode: req.body.zipCode,
				paymentMethod: req.body.paymentMethod,
				cardNumber: req.body.cardNumber,
				expirationDate: req.body.expirationDate,
				cvc: req.body.cvc,
			});
			await newOrder.save();
            await this.model.cartModel.findByIdAndUpdate(req.body.cartId,{
                //@ts-ignore
                user: req?.user._id,
                products: [],
                cartSum: 0,
                cartSumWithDiscount: 0,
            })

			return res.status(200).json({
				fields: "order",
				success: true,
				data: newOrder._id,
				message: "successfully added",
			});
		} catch (error:any) {
            console.log(error)
            return res.status(200).json({
				fields: "order",
				success: true,
				data: null,
				message: error?.message,
			});
        }
	}
	

	async get(req: Request, res: Response) {
	    const errors = validationResult(req);
	    if (!errors.isEmpty()) {
	        return this.showValidationErrors(res as Response, errors);
	    }
        

	    //@ts-ignore
	    const order = await this.model.orderModel.findById(req.params.id).populate("products.productId").exec();
	    if (!order) {
	        return res.status(400).json({
	            fields: "cart",
	            success: false,
	            data: null,
	            message: "orders with this user not found",
	        });
	    }

	    return res.status(200).json({
	        fields: "cart",
	        success: true,
	        data: new Transform().order(order),
	        message: "success",
	    });
	}

	
}
