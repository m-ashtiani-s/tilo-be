import mongoose, { Document, Model, PaginateResult, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

import { FilterQuery, PaginateOptions } from 'mongoose';

type PaginateMethod<T> = (
 query?: FilterQuery<T>,
 options?: PaginateOptions,
 callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;

export interface ColorProduct {
    color: string;
    images: string[] | null;
}

export interface Product {
    title: string;
    rate: number;
    numbersOfRate: Number,
    images: string[] | null;
    price: number;
    discount: number | null;
    discountExpire: Date | null;
    shortInfo: string;
    additionalInfo: string;
    measurement: string;
    colors: ColorProduct[] | null;
    tags: string[] | null;
    category: string[] | null;
}

export interface ProductDocument extends Product, Document {}
// export interface PaginatedProductDocument extends ProductDocument {}

export interface ProductDocumentWithPaginate extends ProductDocument {
    paginate: PaginateMethod<ProductDocument>;
   }
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        numbersOfRate: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        images: [String],
        price: {
            type: Number,
            required: true,
        },
        discount: Number,
        discountExpire: Date,
        shortInfo: {
            type: String,
            required: true,
        },
        additionalInfo: {
            type: String,
            required: true,
        },
        measurement: {
            type: String,
            required: true,
        },
        colors: [],
        tags: [String],
        category: [{type: Schema.Types.ObjectId,ref: 'categories'}],
    },
    { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

const productModel: Model<ProductDocumentWithPaginate> = mongoose.model<ProductDocumentWithPaginate>("products", productSchema);

export default productModel;
