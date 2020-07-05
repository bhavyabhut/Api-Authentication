const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/User.js");

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECREATE,
		},
		async (payload, done) => {
			try {
				const user = await User.findById(payload.sub);
				if (!user) return done(null, false);
				done(null, user);
			} catch (e) {
				done(e, false);
			}
		}
	)
);

// GOogle Oauth strategy

passport.use(
	"googleToken",
	new GooglePlusTokenStrategy(
		{
			clientID:
				"691393398092-s728fi5erskhibo53va092vgimkq0ik6.apps.googleusercontent.com",
			clientSecret: "c7wRuwglP00dvXaB2Hpir1Tb",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const existingUser = await User.findOne({
					"google.id": profile.id,
				});
				if (existingUser) {
					console.log("user is che ");
					return done(null, existingUser);
				}
				const newUser = new User({
					method: "google",
					google: {
						id: profile.id,
						email: profile.emails[0].value,
					},
				});
				await newUser.save();
				done(null, newUser);
			} catch (e) {
				done(e, false, e.message);
			}
		}
	)
);
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ "local.email": email });
				console.log(user);
				if (!user) return done(null, false);
				try {
					const isMatch = await bcrypt.compare(
						password,
						user.local.password
					);
					if (!isMatch) return done(null, false);
					done(null, user);
				} catch (e) {
					console.log(e);
				}
			} catch (e) {
				done(e, false);
			}
		}
	)
);
