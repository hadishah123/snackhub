// backend/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// ---------- Google OAuth Strategy ----------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Use env variable
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by email
        let user = await User.findOne({ email: profile.emails[0].value });

        // If user doesn't exist, create a new one
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "googleauth", // placeholder password
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ---------- Session Serialization ----------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});