const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv").config();
const path = require("path");
const db = require("./config/mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");
const crypto = require("crypto");
const app = express();
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const port = process.env.PORT || 8000;
const qrcode = require("qrcode");

let userProfile;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${port}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      const user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        const user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
          refreshToken: refreshToken,
        });
        return done(null, userProfile);
      }
      console.log(
        "accessToken:",
        accessToken,
        "refreshToken:",
        refreshToken,
        "profile:",
        profile
      );
      return done(null, userProfile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.NGROK}/auth/facebook/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await User.findOne({ id: profile.id });
      if (!user) {
        const user = await User.create({
          name: profile.displayName,
          id: profile.id,
          password: crypto.randomBytes(20).toString("hex"),
          refreshToken: refreshToken,
        });
        return done(null, user);
      }
      console.log(
        "accessToken:",
        accessToken,
        "refreshToken:",
        refreshToken,
        "profile:",
        profile
      );
      return done(null, profile);
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID || "77kpmot3ftw6o5",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "DaI6rZhIMxhX6Q2p",
      callbackURL: `http://localhost:${port}/auth/linkedIn/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      const user = await User.findOne({ email: profile.emails[0].value });
      console.log(user);
      if (!user) {
        const user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
          refreshToken: refreshToken,
        });
        return done(null, userProfile);
      }
      console.log(
        "accessToken:",
        accessToken,
        "refreshToken:",
        refreshToken,
        "profile:",
        profile
      );
      return done(null, profile);
    }
  )
);

app.use("/", require("./router"));

app.listen(port, function (err) {
  if (err) {
    console.log("error", err);
    return;
  }
  console.log(`connected successfully on port: ${port}`);
});
