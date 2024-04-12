const express=require("express");
const v1Router = require("./web/v1");
const webRouter=express.Router()

webRouter.use('/web',v1Router)



module.exports= webRouter;