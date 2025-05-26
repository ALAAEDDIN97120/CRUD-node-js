require("dotenv").config();
const express = require("express");
const connectDB = require("./server/config/db");
const app = express();
connectDB();
app.use(express.static("public"));
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const methodoverride = require("method-override");
app.use(methodoverride("_method"));

//=== SEARCH ===//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: "mysecretkey",
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_DB,
		}),
	})
);

//=== LAYOUT ===//
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//=== ROUTE HANDLERS ===//
const mainRouter = require("./server/route/main");
app.use("/", mainRouter);
const adminRouter = require("./server/route/admin");
app.use("/", adminRouter);

//=== PORT ===//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log("welcome in Port 5000");
});
