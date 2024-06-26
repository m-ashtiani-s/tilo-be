import { validationResult } from "express-validator";
import { Request, Response } from "express";
import Controller from "../controller";
import Transform from "../../../transform/web/v1/transform";
import { Catrgory } from "../../../types/category";

export default class ProductController extends Controller {
    getAll(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        const paginationSetup = {
            limit: req.query.limit || 10,
            page: req.query.page || 1,
            sort: { createdAt: -1 },
        };
        const rateFilter = req.params.rate;
        const { minPrice, maxPrice } = req.query;

        const query: any = {};
        rateFilter && (query.rate = rateFilter);
        if (req.query.category) {
            query.category = { $in: req.query.category };
        }
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: 'i' }; // Use regex for similar title search
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            query.priceWithDiscount = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice !== undefined) {
            query.priceWithDiscount = { $gte: minPrice };
        } else if (maxPrice !== undefined) {
            query.priceWithDiscount = { $lte: maxPrice };
        }

        //@ts-ignore
        this.model.productModel
            //@ts-ignore
            .paginate(query, paginationSetup)
            .then((products: any) => {
                if (!products) {
                    return res.status(400).json({
                        fields: "product",
                        success: false,
                        data: null,
                        message: "no products",
                    });
                }
                return res.json({
                    fields: "product",
                    success: true,
                    data: new Transform().paginatedProducts(products),
                    message: "successfully",
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    fields: "product",
                    success: false,
                    data: null,
                    message: err.message,
                });
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
                    return res.status(400).json({
                        fields: "product",
                        success: false,
                        data: null,
                        message: "no products",
                    });
                }

                return res.json({
                    fields: "product",
                    success: true,
                    data: product,
                    message: "successfully",
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    fields: "product",
                    success: false,
                    data: null,
                    message: err.message,
                });
            });
    }
    getCategoryList(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        this.model.categoryModel
            .find()
            .then((category) => {
                if (!category) {
                    return res.status(404).json({
                        fields: "category",
                        success: false,
                        data: null,
                        message: "Category not found",
                    });
                }
                let categoryList:Catrgory[] =[] ;
                category.map((cat)=>{
                    const catItem={id:cat?._id,name:cat?.title}
                    categoryList.push(catItem)
                })

                return res.json({
                    fields: "product",
                    success: true,
                    data: categoryList,
                    message: "successfully",
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    fields: "product",
                    success: false,
                    data: null,
                    message: err.message,
                });
            });
    }
}
