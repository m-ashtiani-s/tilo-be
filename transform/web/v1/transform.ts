import { ProductDocument } from "../../../models/productModel";

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
    products(items: any) {
        const paginatedItems: Tpage = this.paginate(items);
        let elements:any=[]
        items.docs.map((item:any) => 
            elements.push ({
                _id: item._id,
                title: item.title,
                numbersOfRate: item.numbersOfRate,
                rate: item.rate,
                images: item.images,
                price: item.price,
                discount: item.discount,
                discountExpire: item.discountExpire,
                shortInfo: item.shortInfo,
                additionalInfo: item.additionalInfo,
                measurement: item.measurement,
                colors: item.colors,
                tags: item.tags,
                category: item.category,
                categoryNames:item.categoryNames
            })
        );

        paginatedItems.elements = elements;
        return paginatedItems;
    }
}
