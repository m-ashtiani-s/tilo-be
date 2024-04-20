import { validationResult } from "express-validator";
import Controller from "../../controller";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

export default class AdminProductController extends Controller {
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

                const productCategory = req.body.category || [];
                const newProduct = new this.model.productModel({
                    title: req.body.title,
                    rate: 5,
                    numbersOfRate: 1,
                    images: req.body.images,
                    price: req.body.price,
                    discount: req.body.discount || null,
                    discountExpire: req.body.discountExpire || null,
                    shortInfo: req.body.shortInfo,
                    additionalInfo: req.body.additionalInfo,
                    measurement: req.body.measurement,
                    colors: req.body.colors || null,
                    tags: req.body.tags || null,
                    category: productCategory,
                });

                if (productCategory.length > 0) {
                    const promises = productCategory.map((categoryId: ObjectId) => {
                        return this.model.categoryModel.findById(categoryId).then((categoryName) => {
                            if (!categoryName) {
                                return res.status(400).json({
                                    data: [{ fields: "product", message: "category is not existed" }],
                                    success: false,
                                });
                            }
                            //@ts-ignore
                            categoryName.products.push(newProduct._id);
                            categoryName.save();
                        });
                    });

                    Promise.all(promises)
                        .then(() => {
                            return newProduct.save().then(() => {
                                return res.json({
                                    data: [{ fields: "product", message: "product created successfully" }],
                                    success: true,
                                });
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
                        });
                } else {
                    newProduct
                        .save()
                        .then(() => {
                            return res.json({
                                data: [{ fields: "product", message: "product created successfully" }],
                                success: true,
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
                        });
                }
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

                return res.json({
                    data: [{ fields: "product", message: "successfully", data: products }],
                    success: true,
                });
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

                return res.json({
                    data: [{ fields: "product", message: "successfully", data: product }],
                    success: true,
                });
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
                if (!product) {
                    return res.status(400).json({ data: [{ fields: "product", message: "product not found!" }], success: false });
                }

                if (!!product.category && product?.category?.length > 0) {
                    product.category.map((category) => {
                        this.model.categoryModel.findById(category).then((categoryFound) => {
                            if (!categoryFound) {
                                return res.status(500).json({
                                    data: [{ fields: "product", message: "category not found!" }],
                                    success: false,
                                });
                            }
                            //@ts-ignore
                            const pos = categoryFound.products.indexOf(req.params.id);
                            categoryFound.products.splice(pos, 1);
                            categoryFound.save();
                            return res.json({
                                data: [{ fields: "product", message: "product deleted successfully0" }],
                                success: true,
                            });
                        });
                    });
                } else {
                    return res.json({
                        data: [{ fields: "product", message: "product deleted successfully" }],
                        success: true,
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }
    edit(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res, errors);
        }

        this.model.productModel
            .findById(req.params.id)
            .then((product) => {
                if (!product) {
                    return res.status(400).json({ data: [{ fields: "product", message: "Product not found!" }], success: false });
                }

                const newCategories = req.body.category;
                const checkCategories = this.areArraysEqual(product?.category, newCategories);

                if (!!newCategories && newCategories.length > 0 && !checkCategories) {
                    let updatedProduct = {
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
                        category: [],
                    };
                    let promises: Promise<void>[] = [];
                    let errorCat = false;

                    newCategories.map((cat: ObjectId) => {
                        promises.push(
                            this.model.categoryModel.findById(cat).then((catfound: any) => {
                                if (!catfound) {
                                    errorCat = true;
                                } else {
                                    //@ts-ignore
                                    updatedProduct.category.push(cat);
									if (!catfound.products.includes(req.params.id)) {
										catfound.products.push(req.params.id);
									}
                                    catfound.save();
                                }
                            })
                        );
                    });

                    Promise.all(promises)
                        .then(() => {
                            if (errorCat) {
                                return res.status(400).json({ data: [{ fields: "category", message: "Category not found!" }], success: false });
                            } else {
                                this.model.productModel
                                    .findOneAndUpdate({ _id: req.params.id }, updatedProduct)
                                    .then(() => {
                                        res.json({
                                            data: [{ fields: "product", message: "Product edited successfully" }],
                                            success: true,
                                        });
                                    })
                                    .catch((err) => {
                                        res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
                                    });
                            }
                        })
                        .catch((err) => {
                            res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
                        });
                } else {
                    let updatedProduct = {
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
                    };

                    this.model.productModel
                        .findOneAndUpdate({ _id: req.params.id }, updatedProduct)
                        .then(() => {
                            return res.json({
                                data: [{ fields: "product", message: "Product edited successfully" }],
                                success: true,
                            });
                        })
                        .catch((err) => {
                            return res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
                        });
                }
            })
            .catch((err) => {
                res.status(500).json({ data: [{ fields: "product", message: err.message }], success: false });
            });
    }
}
