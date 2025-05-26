const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.jwtSecret;
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

//=== Auth MiddleWare ===//
const authMiddleWare = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: "UnAuthorized" });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(401).json({ message: "UnAuthorized" });
	}
};

//=== Login post EndPoint ===//
router.post("/admin", async (req, res) => {
	try {
		const locals = {
			title: "admin",
		};
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id }, jwtSecret);
		res.cookie("token", token, { httpOnly: true });

		console.log(req.body);
		res.redirect("/admin");
	} catch (erorr) {
		console.log(erorr);
	}
});

//=== dashboard Endpoint ===//
router.get("/dashboard", authMiddleWare, async (req, res) => {
	const data = {
		title: "Dashboard",
	};
	const locals = await Post.find();
	res.render("admin/dashboard", { data, locals, layout: adminLayout });
});

//=== Add Post Page Endpoint ===//
router.get("/add-post", authMiddleWare, async (req, res) => {
	const data = {
		title: "Add Post",
	};
	const locals = await Post.find();
	res.render("admin/add-post", { data, layout: adminLayout });
});

//=== Add Post Endpoint ===//
router.post("/add-post", authMiddleWare, async (req, res) => {
	try {
		console.log(req.body);
		await Post.create({
			title: req.body.title,
			body: req.body.body,
		});
		res.redirect("/dashboard");
	} catch (error) {
		console.log(error);
		res.render("admin/add-post", { layout: adminLayout });
	}
});

//=== Edit Post req Endpoint ===//
router.get("/edit-post/:id", authMiddleWare, async (req, res) => {
	try {
		const locals = {
			title: "edit post",
		};
		const data = await Post.findOne({ _id: req.params.id });
		res.render(`admin/edit-post`, {
			data,
			layout: adminLayout,
			locals,
		});
	} catch (error) {
		console.log(error);
	}
});

//=== Edit Post req Endpoint ===//
router.put("/edit-post/:id", authMiddleWare, async (req, res) => {
	try {
		await Post.findByIdAndUpdate(req.params.id, {
			title: req.body.title,
			body: req.body.body,
			updateAt: Date.now(),
		});

		res.redirect(`/edit-post/${req.params.id}`);
	} catch (error) {
		console.log(error);
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

//=== Delete Post Endpoint ===//
router.delete("/delete-post/:id", authMiddleWare, async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id });
		res.redirect("/dashboard");
	} catch (error) {
		console.log("error");
	}
});

router.get("/logout", async (req, res) => {
	res.clearCookie("token");
	res.redirect("/");
});

module.exports = router;
