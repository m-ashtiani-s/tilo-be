import { validationResult } from "express-validator";
import Controller from "../../controller";
import { Request, Response } from "express";

export default class ProductController extends Controller {
    create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }
        this.model.productModel
            .findOne({ title: req.body.title })
            .then((product) => {
                if (product) {
                    return res.status(400).json({ data: [{ fields: "product", message: "product is existed" }], success: false });
                }
                const newProduct = new this.model.productModel({
                    title: req.body.title,
                    rate: 5,
                    numbersOfRate: 1,
                    images: req.body.images,
                    price: req.body.price,
                    discount: req.body.discount,
                    discountExpire: req.body.discountExpire,
                    shortInfo: req.body.shortInfo,
                    additionalInfo: req.body.additionalInfo,
                    measurement: req.body.measurement,
                    colors: req.body.colors,
                    tags: req.body.tags,
                    category: req.body.category,
                });

                newProduct.save();

                return res.json({ data: [{ fields: "product", message: "product created successfully" }], success: true });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }

    getAll(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        const paginationSetup = {
            limit: req.query.limit || 10,
            page: req.query.page || 1,
        };
        //@ts-ignore
        this.model.productModel
            //@ts-ignore
            .paginate({}, { limit: paginationSetup.limit, page: paginationSetup.page })
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

    delete(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        this.model.productModel
            .findByIdAndDelete(req.params.id)
            .then((product) => {
                if (!!product) {
                    return res.json({ data: [{ fields: "product", message: "product deleted successfully" }], success: true });
                } else {
                    return res.status(400).json({ data: [{ fields: "product", message: "product not found!" }], success: false });
                }
            })
            .catch((err) => {
                res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }
    edit(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        const updatedProduct = {
            title: req.body.title,
            images: req.body.images,
            price: req.body.price,
            discount: req.body.discount,
            discountExpire: req.body.discountExpire,
            shortInfo: req.body.shortInfo,
            additionalInfo: req.body.additionalInfo,
            measurement: req.body.measurement,
            colors: req.body.colors,
            tags: req.body.tags,
            category: req.body.category,
        };

        this.model.productModel
            .findByIdAndUpdate(req.params.id, updatedProduct)
            .then((product) => {
                if (!!product) {
                    return res.json({ data: [{ fields: "product", message: "product edited successfully" }], success: true });
                } else {
                    return res.status(400).json({ data: [{ fields: "product", message: "product not found!" }], success: false });
                }
            })
            .catch((err) => {
                res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }
}
