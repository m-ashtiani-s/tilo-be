import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";




export interface ProductInCart {
    productId: ObjectId;
    quantity: number;
}

export interface Cart {
    user: ObjectId;
    products: ProductInCart[];
    cartSum: number;
    cartSumWithDiscount: number;
}

export interface CartDocument extends Cart, Document {
    createdAt:Date,
    updatedAt:Date
}

const productSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true },
});

const cartSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        products: [productSchema],
        cartSum: { type: Number, required: true },
        cartSumWithDiscount: { type: Number, required: true }
    },
    { timestamps: true }
);


const cartModel: Model<CartDocument> = mongoose.model<CartDocument>("cart", cartSchema);

export default cartModel;
