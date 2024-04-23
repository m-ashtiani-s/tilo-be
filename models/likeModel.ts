import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";



export interface Like {
    user:ObjectId
    products:string[],

}

export interface LikeDocument extends Like, Document {}


const likeSchema = new mongoose.Schema(
    {
        user:{type: Schema.Types.ObjectId,ref: 'user'},
        products:[{type: Schema.Types.ObjectId,ref: 'products'}]
    },
    { timestamps: true }
);


const likeModel: Model<LikeDocument> = mongoose.model<LikeDocument>("like", likeSchema);

export default likeModel;
