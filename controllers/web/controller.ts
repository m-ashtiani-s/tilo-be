import { Result, ValidationError } from "express-validator";
import otpModel, { OTP, OTPDocument } from "../../models/otpModel";
import userModel, { User, UserDocument } from "../../models/userModels";
import { Response } from 'express';
import { Model, ObjectId } from "mongoose";
import productModel, { ProductDocument, ProductDocumentWithPaginate }  from "../../models/productModel";
import categoryModel,{ CategoryDocumentWithPaginate } from "../../models/categoryModel";

interface Models {
    userModel: Model<UserDocument>;
    otpModel: Model<OTPDocument>;
    productModel: Model<ProductDocumentWithPaginate>;
    categoryModel: Model<CategoryDocumentWithPaginate>;
}

export default class Controller {
    model: Models;
    constructor() { 
        this.model = { userModel, otpModel,productModel,categoryModel };
    }
    showValidationErrors(res: Response, errors: Result<ValidationError>) {
        const errorArray = errors.array().map(error => ({
            field: 'err',
            message: error.msg,
        }));

        return res.status(500).json({
            data: errorArray,
            success: false,
        });
    }

    generateOtp() {
        return Math.floor(Math.random() * 90000) + 10000;
    }

     areArraysEqual(arr1:string[], arr2:string[]) {
        if (arr1.length !== arr2.length) {
            return false;
        }
    
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();
    
        // Compare the sorted arrays
        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
                return false;
            }
        }
    
        return true;
    }
};
