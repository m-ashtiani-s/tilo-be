import jwt from "jsonwebtoken";
import userModel from "../models/userModels";
import { Request, Response } from "express";

const AuthHandler = (req: Request, res: Response, next: any) => {
    const token = req.headers["token"];
    if (token) {
        //@ts-ignore
        return jwt.verify(token, process.env.SECRET_KEY, (err, decode: jwt.JwtPayload) => {
            if (err) {
                return res.json({
                    success: false,
                    data: "Failed to authenticate token.",
                });
            }
            if (!!decode) {
                userModel
                    .findById(decode.user_id)
                    .then((user) => {
                        if (user) {
                            req.user = user;
                            next();
                        } else {
                            return res.json({
                                success: false,
                                data: "User not found",
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) throw err;
                    });
            }
        });
    }

    return res.status(401).json({
        data: { field: "", message: "you dont have permission for this route" },
        success: false,
    });
};


export default AuthHandler;