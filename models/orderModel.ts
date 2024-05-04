import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface ProductInOrder {
	productId: ObjectId;
	quantity: number;
}

export interface Order {
	user: ObjectId;
	products: ProductInOrder[];
	orderSum: number;
	orderSumWithDiscount: number;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	streetAddress: string;
	country: string;
	townCity: string;
	state: string;
	zipCode: string;
	paymentMethod: string;
	cardNumber?: string;
	expirationDate?: string;
	cvc?: string;
}

export interface OrderDocument extends Order, Document {
	createdAt: Date;
	updatedAt: Date;
}

const productSchema = new Schema({
	productId: { type: Schema.Types.ObjectId, ref: "products" },
	quantity: { type: Number, required: true },
});

const orderSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		products: [productSchema],
		orderSum: { type: Number, required: true },
		orderSumWithDiscount: { type: Number, required: true },

		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		email: { type: String, required: true },
		streetAddress: { type: String, required: true },
		country: { type: String, required: true },
		townCity: { type: String, required: true },
		state: { type: String, required: true },
		zipCode: { type: String, required: true },
		paymentMethod: { type: String, required: true },
		cardNumber: String,
		expirationDate: String,
		cvc: String,
	},
	{ timestamps: true }
);

const orderModel: Model<OrderDocument> = mongoose.model<OrderDocument>("order", orderSchema);

export default orderModel;
