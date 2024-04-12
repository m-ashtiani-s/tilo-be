const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
require("dotenv").config();
const connectDB = require("./config/db");
const webRouterRouter = require("./routes/api");


const app = express();
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(express.json())
app.use(cookieParser())
app.use('/api',webRouterRouter)

const PORT = 8000 || process.env.PORT;
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("server running");
	});
});
