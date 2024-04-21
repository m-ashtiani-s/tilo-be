import { Request, Response } from "express";
import { UserDocument } from "../models/userModels";

type requestWithUser=Request & {
    user:UserDocument,

}

const AdminAuthHandler= (req:Request, res:Response, next:any) => {
    //@ts-ignore
	if (req?.user?.role == "ADMIN") {
		return next();
	} else {
		return res.status(403).json({
			data: { field: "", message: "you dont have permission for this route" },
			success: false,
		});
	}
};

export default AdminAuthHandler;