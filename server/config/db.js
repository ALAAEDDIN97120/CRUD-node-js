const mongoose = require("mongoose");
const connectDB = async () => {
	try {
		mongoose.set("strictQuery", false);
		const conn = await mongoose.connect(process.env.MONGO_DB);
		console.log("database connected");
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
