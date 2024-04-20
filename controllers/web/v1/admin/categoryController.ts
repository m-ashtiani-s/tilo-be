import { validationResult } from "express-validator";
import Controller from "../../controller";
import { Request, Response } from "express";

export default class CategoryController extends Controller {
    create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }
        this.model.categoryModel
            .findOne({ title: req.body.title })
            .then((category) => {
                if (category) {
                    return res.status(400).json({ data: [{ fields: "category", message: "category is existed" }], success: false });
                }
                const newCategory = new this.model.categoryModel({
                    title: req.body.title,
                    description: req.body.description || null,
                });

                newCategory.save();

                return res.json({
                    data: [{ fields: "category", message: "category created successfully" }],
                    success: true,
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: [{ fields: "category", message: err.message }], success: false });
            });
    }

    getAll(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        //@ts-ignore
        this.model.categoryModel
            .find()
            .then((categories: any) => {
                if (!categories) {
                    return res.status(400).json({ data: [{ fields: "category", message: "no categories" }], success: false });
                }

                return res.json({
                    data: [{ fields: "category", message: "successfully", data: categories }],
                    success: true,
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: [{ fields: "category", message: err.message }], success: false });
            });
    }
    get(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        this.model.categoryModel
            .findById(req.params.id)
            .then((category: any) => {
                if (!category) {
                    return res.status(400).json({ data: [{ fields: "category", message: "no categories" }], success: false });
                }

                return res.json({
                    data: [{ fields: "category", message: "successfully", data: category }],
                    success: true,
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: [{ fields: "category", message: err.message }], success: false });
            });
    }

    delete(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        this.model.categoryModel
            .findByIdAndDelete(req.params.id)
            .then((category) => {
                if (!category) {
                    return res.status(400).json({ data: [{ fields: "category", message: "category not found!" }], success: false });
                }

                const productsInCategory = category.products || [];
                const promises = productsInCategory.map((p: any) => {
                    return this.model.productModel.findById(p).then((product) => {
                        if (product) {
                            const categories = product.category;
                            const filteredCategories = categories?.filter((c) => {
								console.log(category._id==c)
                                return c.toString() != category._id.toString();
                            });
                            const newProduct = { ...product.toObject() };
                            newProduct.category = filteredCategories;
                            return product.updateOne(newProduct);
                        }
                    });
                });

                // Wait for all product.save() promises to resolve
                return Promise.all(promises).then(() => {
                    return res.json({
                        data: [{ fields: "category", message: "category deleted successfully" }],
                        success: true,
                    });
                });
            })
            .catch((err) => {
                res.status(500).json({ data: [{ fields: "category", message: err.message }], success: false });
            });
    }
    edit(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        const updatedCategory = {
            title: req.body.title,
            description: req.body.description || null,
        };

        this.model.categoryModel
            .findByIdAndUpdate(req.params.id, updatedCategory)
            .then((category) => {
                if (!!category) {
                    return res.json({
                        data: [{ fields: "category", message: "category edited successfully" }],
                        success: true,
                    });
                } else {
                    return res.status(400).json({ data: [{ fields: "category", message: "category not found!" }], success: false });
                }
            })
            .catch((err) => {
                res.status(500).json({ data: [{ fields: "category", message: err.message }], success: false });
            });
    }
}
