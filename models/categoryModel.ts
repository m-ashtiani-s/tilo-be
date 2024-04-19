import mongoose, { Document, Model, PaginateResult, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { FilterQuery, PaginateOptions } from 'mongoose';

type PaginateMethod<T> = (
 query?: FilterQuery<T>,
 options?: PaginateOptions,
 callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;



export interface Category {
    title:string
    products:[],

}

export interface CategoryDocument extends Category, Document {}

export interface CategoryDocumentWithPaginate extends CategoryDocument {
    paginate: PaginateMethod<CategoryDocument>;
   }
const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description:String,
        products:[{type: Schema.Types.ObjectId,ref: 'products'}]
    },
    { timestamps: true }
);

categorySchema.plugin(mongoosePaginate);

const categoryModel: Model<CategoryDocumentWithPaginate> = mongoose.model<CategoryDocumentWithPaginate>("categories", categorySchema);

export default categoryModel;
