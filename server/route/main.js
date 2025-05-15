const express = require("express");
const router = express.Router();

//=== ROUTE HANDLERS ===//

// === GET Endpoints ===//
router.get("/", (req, res) => {
	res.render("index", {
		title: "Home node.js",
		desc: "full course about node.js ",
	});
});

router.get("/about", (req, res) => {
	res.render("about", {
		title: "learn node.js",
		desc: "full course about node.js ",
	});
});

module.exports = router;
