const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//=== ROUTE HANDLERS ===//

// === GET Endpoints ===//
router.get("/", async (req, res) => {
	try {
		const data = await Post.find();
		res.render("index", { data });
	} catch (error) {
		console.log(error);
	}
});

router.get("/post/:postId", async (req, res) => {
	try {
		const postId = req.params.postId;
		const data = await Post.findById(postId);
		res.render("post", { data });
	} catch (error) {
		console.log(error);
	}
});

router.get("/about", (req, res) => {
	res.render("about");
});

//=== POST EndPoints ===//

router.post("/search", async (req, res) => {
	const data = {
		title: "search",
	};
	const searchTerm = req.body.searchTerm;
	const results = await Post.find({
		$or: [
			{ title: { $regex: searchTerm, $options: "i" } },
			{ body: { $regex: searchTerm, $options: "i" } },
		],
	});

	if (results.length > 0) {
		res.render("search", { data, results, searchTerm });
	} else {
		res.render("search", { results: [], searchTerm, data });
	}
});

module.exports = router;

// function insertPost() {
// 	post.insertMany([
// 		{
// 			title: "Life in the Mountains",
// 			body: "Living in the mountains brings peace and serenity like nowhere else.",
// 		},
// 		{
// 			title: "The Future of AI",
// 			body: "Artificial intelligence is rapidly transforming every industry around us.",
// 		},
// 		{
// 			title: "A Day at the Beach",
// 			body: "Sun, sand, and waves make the perfect summer escape.",
// 		},
// 		{
// 			title: "Healthy Eating Habits",
// 			body: "Incorporating vegetables and whole grains leads to better health outcomes.",
// 		},
// 		{
// 			title: "Travel Tips for Europe",
// 			body: "Pack light, learn basic local phrases, and always carry a power adapter.",
// 		},
// 	]);
// }
// insertPost();
