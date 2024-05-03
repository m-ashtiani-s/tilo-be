import { validationResult } from "express-validator";
import Controller from "../controller";
import { Request, Response } from "express";
import { UserDocument } from "../../../models/userModels";
import Transform from "../../../transform/web/v1/transform";

export default class LikeController extends Controller {
    async create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }
        //@ts-ignore
        const likes = await this.model.likeModel.findOne({ user: req.user._id });
        if (!likes) {
            return res.status(400).json({
                fields: "likes",
                success: false,
                data: null,
                message: "likes with this user not found",
            });
        }
        if (likes?.products.includes(req.body.productId)) {
            const index = likes?.products?.indexOf(req.body.productId);
            if (index > -1) {
                likes?.products.splice(index, 1);
                likes.save();
            }
            const productUnLiked = await this.model.productModel.findById(req.body.productId);
            if (!productUnLiked) {
                return res.status(400).json({
                    fields: "product",
                    success: false,
                    data: null,
                    message: "product not found",
                });
            }
            productUnLiked.numbersOfRate=(productUnLiked.numbersOfRate as number)-1
            productUnLiked.save()
            return res.status(200).json({
                fields: "likes",
                success: true,
                data: null,
                message: "unliked successfully",
            });
        } else {
            const productLiked = await this.model.productModel.findById(req.body.productId);
            if (!productLiked) {
                return res.status(400).json({
                    fields: "product",
                    success: false,
                    data: null,
                    message: "product not found",
                });
            }
            productLiked.numbersOfRate=(productLiked.numbersOfRate as number)+1
            likes?.products.push(req.body.productId);
            productLiked.save()
            likes?.save();
            return res.status(200).json({
                fields: "likes",
                success: true,
                data: null,
                message: "liked successfully",
            });
        }
    }

    async get(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }


        //@ts-ignore
        const liked=await this.model.likeModel.findOne({user:req.user._id}).populate('products').exec()
        if(!liked){
            return res.status(400).json({
                fields: "product",
                success: false,
                data: null,
                message: "fail in find liked products",
            });
        }

        return res.status(200).json({
            fields: "likes",
            success: true,
            data: new Transform().products(liked?.products),
            message: "successfully",
        });
    }
}
