const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const webRouterRouter = require("./routes/api");
const mongoose = require("mongoose");
const app = require("express")();

mongoose.connect("mongodb://127.0.0.1:27017/tilo-db");
mongoose.Promise = global.Promise;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", webRouterRouter);

app.listen(8000, () => {
	console.log(`server running on port ${8000}`);
});
