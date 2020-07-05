const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const router = require("./router/userRouter.js");
const passport = require("passport");
// const { google } = require("googleapis");

// const { OAuth2 } = google.auth;

// const oAuthClient = new OAuth2();

// oAuthClient.setCredentials();
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on(
	"error",
	console.error.bind(console, "connection error:")
);
// mongoose.connection.once("open", () => {
// 	console.log("database connect....");
// });

mongoose.connection.on("connected", () => {
	console.log("Data base connect...");
});
// const calendar = google.calendar({
// 	{version:"v3"}
// })
app.use(passport.initialize());
app.use("/api", router);
const port = process.env.PORT_NUM || 3000;

app.listen(port, () => {
	console.log("server is starting " + port);
});
