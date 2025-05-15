const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
	title: {
		type: String,
		require: true,
	},
	body: {
		type: String,
		require: true,
	},
	createdAt: {
		type: Date,
		require: true,
	},
	updateAt: {
		type: Date,
		default: Date.new,
	},
});

module.exports = mongoose.model("Post", PostSchema);
