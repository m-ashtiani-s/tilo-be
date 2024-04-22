import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import webRouterRouter from "./routes/api";
import mongoose from "mongoose";
const app = require("express")();

mongoose.connect("mongodb://127.0.0.1:27017/tilo-db");
mongoose.Promise = global.Promise;

app.use(
	cors({
		origin: "http://localhost:3000",
		// credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", webRouterRouter);

app.listen(8000, () => {
	console.log(`server running on port ${8000}`);
});
