const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const tokenGenerator = (user) => {
	return JWT.sign(
		{
			iss: "MY_APP_API",
			sub: user.id,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1),
		},
		process.env.SECREATE
	);
};
const hashPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		console.log(hash);
		return hash;
	} catch (e) {
		console.log(e);
	}
};
const singup = async (req, res, next) => {
	try {
		const foundUser = await User.findOne({
			"local.email": req.value.body.email,
		});
		console.log(foundUser);
		if (foundUser) {
			return res.status(400).json({ err: "Email alerady exsist..." });
		}
		const { email, password } = req.value.body;
		console.log(email, password);
		const user = new User({
			method: "local",
			local: {
				email,
				password: await hashPassword(password),
			},
		});
		const x = await user.save();
		console.log(x);
		const token = tokenGenerator(user);
		res.status(201).json({
			msg: user,
			token,
		});
	} catch (e) {
		res.status(404).json({
			error: e,
		});
	}
};
const singin = (req, res, next) => {
	const token = tokenGenerator(req.user);
	res.status(201).json({
		msg: "created",
		token,
	});
	res.send("singin done");
};
const privet = (req, res, next) => {
	res.send(
		"congrets commands you success full access privet my pic 🎇🎇🎇🎇🎇 "
	);
};

const googleAuth = async (req, res) => {
	console.log(req.user);
	const token = tokenGenerator(req.user);
	res.status(200).json({ token });
};
module.exports = { singup, singin, privet, googleAuth };
