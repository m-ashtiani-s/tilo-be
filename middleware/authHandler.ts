import jwt from "jsonwebtoken";
import userModel from "../models/userModels";
import { Request, Response } from "express";

const AuthHandler = (req: Request, res: Response, next: any) => {
	const token = req.headers["token"];
	if (token) {
		//@ts-ignore
		return jwt.verify(token, process.env.SECRET_KEY, (err, decode: jwt.JwtPayload) => {
			if (err) {
				return res.status(401).json({
					fields: "product",
					success: false,
					data: null,
					message: "Failed to authenticate token.",
					code:401
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
							return res.status(401).json({
								fields: "product",
								success: false,
								data: null,
								message: "User not found",
								code:401
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
		fields: "product",
		success: false,
		data: null,
		message: "you dont have permission for this route",
		code:401
	});
};

export default AuthHandler;
