import express from "express";
import v1Router from "./web/v1";
const webRouter=express.Router()

webRouter.use('/web',v1Router)



export default webRouter;