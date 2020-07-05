const express = require("express");
const router = express.Router();
const passport = require("passport");

const passportConfi = require("../passport.js");
const {
	singup,
	singin,
	privet,
	googleAuth,
} = require("../controller/userController.js");
const { schema, validator } = require("../helpers/routeHelper.js");

router.route("/singup").post(validator(schema), singup);

router
	.route("/singin")
	.post(
		validator(schema),
		passport.authenticate("local", { session: false }),
		singin
	);

router
	.route("/privet")
	.get(passport.authenticate("jwt", { session: false }), privet);

router
	.route("/oauth/google")
	.post(passport.authenticate("googleToken", { session: false }), googleAuth);

module.exports = router;
