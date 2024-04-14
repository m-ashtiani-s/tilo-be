import { Result, ValidationError } from "express-validator";
import otpModel, { OTP, OTPDocument } from "../../models/otpModel";
import userModel, { User, UserDocument } from "../../models/userModels";
import { Response } from 'express';
import { Model } from "mongoose";

interface Models {
    userModel: Model<UserDocument>;
    otpModel: Model<OTPDocument>;
}

export default class Controller {
    model: Models;
    constructor() { 
        this.model = { userModel, otpModel };
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
};
