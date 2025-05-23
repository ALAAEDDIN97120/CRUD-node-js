const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const adminLayout = "../views/layouts/admin";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/admin", async (req, res) => {
	try {
		const locals = {
			title: "admin",
		};

		res.render("admin/index", { locals, layout: adminLayout });
	} catch (erorr) {
		console.log(erorr);
	}
});

//=== Login post EndPoint ===//

router.post("/admin", async (req, res) => {
	try {
		const locals = {
			title: "admin",
		};
		const { username, password } = req.body;
		console.log(req.body);
		res.redirect("/admin");
	} catch (erorr) {
		console.log(erorr);
	}
});

//=== Register post EndPoint ===//

router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 6);

		try {
			const user = await User.create({ username, password: hashedPassword });
			res.status(201).json({ message: "user Created", user });
		} catch (error) {
			if (error.code === 11000) {
				res.status(409).json({ message: "user already taken" });
			}
			res.status(500).json({ message: "Internal server error" });
		}

		res.redirect("/admin");
	} catch (erorr) {
		console.log(erorr);
	}
});

module.exports = router;
