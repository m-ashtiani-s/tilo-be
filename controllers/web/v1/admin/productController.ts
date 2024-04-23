import { validationResult } from "express-validator";
import Controller from "../../controller";
import { Request, Response } from "express";
// import { ObjectId } from "mongoose";
import Transform from "../../../../transform/web/v1/transform";
import { ObjectId } from "mongodb";

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
                    featuredImage: req.body.featuredImage,
                    price: req.body.price,
                    priceWithDiscount: req.body.priceWithDiscount,
                    discount: req.body.discount || null,
                    discountExpire: req.body.discountExpire || null,
                    shortInfo: req.body.shortInfo,
                    additionalInfo: req.body.additionalInfo,
                    measurement: req.body.measurement,
                    colors: req.body.colors || null,
                    tags: req.body.tags || null,
                    category: productCategory,
                    categoryNames: [],
                });

                if (productCategory.length > 0) {
                    let promises: Promise<void>[] = [];
                    let errorCat = false;

                    productCategory.map((categoryId: ObjectId) => {
                        promises.push(
                            //@ts-ignore
                            this.model.categoryModel.findById(categoryId).then((categoryName) => {
                                if (!categoryName) {
                                    errorCat = true;
                                } else {
                                    newProduct.categoryNames.push(categoryName.title);
                                    //@ts-ignore
                                    categoryName.products.push(newProduct._id);
                                    categoryName.save();
                                }
                            })
                        );
                    });

                    Promise.all(promises)
                        .then(() => {
                            if (errorCat) {
                                return res.status(400).json({
                                    data: [{ fields: "product", message: "category is not existed" }],
                                    success: false,
                                });
                            } else {
                                newProduct.save().then(() => {
                                    return res.json({
                                        data: [{ fields: "product", message: "product created successfully" }],
                                        success: true,
                                    });
                                });
                            }
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
        const { minPrice, maxPrice } = req.query;

        const query: any = {};

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
                    return res.status(400).json({ data: { fields: "product", message: "no products" }, success: false });
                }

                return res.json({
                    data: { fields: "product", message: "successfully", data: new Transform().paginatedProducts(products) },
                    success: true,
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({ data: { fields: "product", message: err.message }, success: false });
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

    async delete(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return this.showValidationErrors(res as Response, errors);
        }

        this.model.productModel
            .findByIdAndDelete(req.params.id)
            .then(async (product) => {
                if (!product) {
                    return res.status(400).json({ data: [{ fields: "product", message: "product not found!" }], success: false });
                }

                const liked = await this.model.likeModel.findOne({
                    products: {
                        $elemMatch: {
                            $eq: req.params.id,
                        },
                    },
                });

                if (liked) {
                    const index = liked?.products?.indexOf(req.params.id);
                    if (index > -1) {
                        liked?.products.splice(index, 1);
                        liked.save();
                    }
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
            .then(async (product) => {
                if (!product) {
                    return res.status(400).json({ data: [{ fields: "product", message: "Product not found!" }], success: false });
                }

                const newCategories = req.body.category || [];
                let errorCat = false;

                for (const cat of newCategories) {
                    const catfound = await this.model.categoryModel.findById(cat);
                    if (!catfound) {
                        errorCat = true;
                    }
                }

                if (!!product?.category && product?.category?.length > 0 && !errorCat) {
                    for (const cat of product.category) {
                        const catfound = await this.model.categoryModel.findById(cat);
                        if (!catfound) {
                            errorCat = true;
                        } else {
                            const productsInCategory = [...catfound.products];
                            const newProducts = productsInCategory.filter((p: any) => p.toString() !== req.params.id);
                            const newCat: any = { ...catfound.toObject() };
                            newCat.products = newProducts;
                            await catfound.updateOne(newCat);
                        }
                    }
                }

                let updatedProduct: any = {
                    title: req.body.title,
                    images: req.body.images,
                    featuredImage: req.body.featuredImage,
                    price: req.body.price,
                    priceWithDiscount: req.body.priceWithDiscount,
                    discount: req.body.discount,
                    discountExpire: req.body.discountExpire,
                    shortInfo: req.body.shortInfo,
                    additionalInfo: req.body.additionalInfo,
                    measurement: req.body.measurement,
                    colors: req.body.colors,
                    tags: req.body.tags,
                    category: [],
                    categoryNames: [],
                };

                let promises: Promise<void>[] = [];

                if (!errorCat) {
                    for (const cat of newCategories) {
                        promises.push(
                            this.model.categoryModel.findById(cat).then(async (catfound: any) => {
                                if (catfound && !errorCat) {
                                    updatedProduct.categoryNames.push(catfound?.title);
                                    updatedProduct.category.push(catfound?._id);
                                    if (!catfound.products.includes(req.params.id)) {
                                        catfound.products.push(req.params.id);
                                    }
                                    await catfound.save();
                                }
                            })
                        );
                    }
                }

                await Promise.all(promises);

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
    }
}
