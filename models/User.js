const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
	method: {
		type: String,
		enum: ["local", "google", "facebook"],
	},
	local: {
		email: {
			type: String,
		},
		password: {
			type: String,
		},
	},
	google: {
		id: {
			type: String,
		},
		email: {
			type: String,
		},
	},
	facebook: {
		id: {
			type: String,
		},
		email: {
			type: String,
		},
	},
});

module.exports = mongoose.model("API", userSchema);
