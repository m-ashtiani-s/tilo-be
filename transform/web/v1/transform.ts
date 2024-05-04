import { ObjectId } from "mongoose";
import { Cart, CartDocument } from "../../../models/cartModel";
import { ProductDocument } from "../../../models/productModel";
import { OrderDocument } from "../../../models/orderModel";

interface ProductsInCart {
    _id: ObjectId;
    title: string;
    featuredImage: string;
    price: string;
    priceWithDiscount: string;
    discount: number | null;
    quantity: number;
}

interface Tpage {
    page: number;
    totalElements: number;
    totalPages: number;
    limit: number;
    elements: any[];
}

export default class Transform {
    paginate(items: any) {
        return {
            page: items.page,
            totalElements: items.totalDocs,
            totalPages: items.totalPages,
            limit: items.limit,
            elements: [],
        };
    }
    paginatedProducts(items: any) {
        const paginatedItems: Tpage = this.paginate(items);
        let elements: any = [];
        items.docs.map((item: any) =>
            elements.push({
                _id: item._id,
                title: item.title,
                numbersOfRate: item.numbersOfRate,
                rate: item.rate,
                images: item.images,
                featuredImage: item.featuredImage,
                price: item.price,
                priceWithDiscount: item.priceWithDiscount,
                discount: item.discount,
                discountExpire: item.discountExpire,
                shortInfo: item.shortInfo,
                additionalInfo: item.additionalInfo,
                measurement: item.measurement,
                colors: item.colors,
                tags: item.tags,
                category: item.category,
                categoryNames: item.categoryNames,
            })
        );

        paginatedItems.elements = elements;
        return paginatedItems;
    }
    products(items: any) {
        let elements: any = [];
        items.map((item: any) =>
            elements.push({
                _id: item._id,
                title: item.title,
                numbersOfRate: item.numbersOfRate,
                rate: item.rate,
                images: item.images,
                featuredImage: item.featuredImage,
                price: item.price,
                priceWithDiscount: item.priceWithDiscount,
                discount: item.discount,
                discountExpire: item.discountExpire,
                shortInfo: item.shortInfo,
                additionalInfo: item.additionalInfo,
                measurement: item.measurement,
                colors: item.colors,
                tags: item.tags,
                category: item.category,
                categoryNames: item.categoryNames,
            })
        );
        return elements;
    }

    cart(items: CartDocument) {
        let productsInCart: ProductsInCart[] = [];
        items?.products?.map((item: any) => {
            let product = {
                _id: item.productId._id,
                title: item.productId.title,
                featuredImage: item.productId.featuredImage,
                price: item.productId.price,
                priceWithDiscount: item.productId.priceWithDiscount,
                discount: item.productId.discount,
                quantity: item?.quantity,
            };
            productsInCart.push(product);
        });
        const cart = {
            _id:items._id,
            products: productsInCart,
            cartSum: items.cartSum,
            cartSumWithDiscount: items.cartSumWithDiscount,
            createdAt: items.createdAt,
            updatedAt: items.updatedAt,
        };

        return cart;
    }
    order(items: OrderDocument) {
        let productsInCart: ProductsInCart[] = [];
        items?.products?.map((item: any) => {
            let product = {
                _id: item.productId._id,
                title: item.productId.title,
                featuredImage: item.productId.featuredImage,
                price: item.productId.price,
                priceWithDiscount: item.productId.priceWithDiscount,
                discount: item.productId.discount,
                quantity: item?.quantity,
            };
            productsInCart.push(product);
        });
        const cart = {
            _id:items._id,
            products: productsInCart,
            orderSum: items.orderSum,
            orderSumWithDiscount: items.orderSumWithDiscount,
            createdAt: items.createdAt,
            updatedAt: items.updatedAt,
            paymentMethod: items.paymentMethod
        };

        return cart;
    }
}
