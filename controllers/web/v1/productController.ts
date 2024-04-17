import { validationResult } from "express-validator";
import { Request, Response } from "express";
import Controller from "../controller";

export default class ProductController1 extends Controller {
    
    getAll(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        const paginationSetup = {
            limit: req.query.limit || 10,
            page: req.query.page || 1,
        };
        const rate=5
        const query = rate ? { rate: parseInt(rate.toString()) } : {};

        
        //@ts-ignore
        this.model.productModel
            //@ts-ignore
            .paginate(query, paginationSetup)
            .then((products: any) => {
                if (!products) {
                    return res.status(400).json({ data: [{ fields: "product", message: "no products" }], success: false });
                }

                return res.json({ data: [{ fields: "product", message: "successfully", data: products }], success: true });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }
    get(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        this.model.productModel
            .findById(req.params.id)
            .then((product: any) => {
                if (!product) {
                    return res.status(400).json({ data: [{ fields: "product", message: "no products" }], success: false });
                }

                return res.json({ data: [{ fields: "product", message: "successfully", data: product }], success: true });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }

    
}
