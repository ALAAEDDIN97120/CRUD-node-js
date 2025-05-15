require("dotenv").config();
const express = require("express");
const connectDB = require("./server/config/db");
const app = express();
connectDB();
app.use(express.static("public"));

//=== SEARCH ===//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//=== LAYOUT ===//
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//=== ROUTE HANDLERS ===//
const mainRouter = require("./server/route/main");
app.use("/", mainRouter);

//=== PORT ===//
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
	console.log("welcome in Port 5000");
});
