const express = require("express");
const User = require("../models/user");
const router = express.Router();
const qrcode = require("qrcode");
//const logger = require("lo");
const passport = require("passport");
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  return res.render("welcome");
});
router.get("/signin", (req, res) => {
  return res.render("signIn");
});

router.post("/create", async (req, res) => {
  try {
    const text = req.query;
    console.log(text);
    if (req.body.password !== req.body.confirmPassword) {
      return res.redirect("back");
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      await User.create(req.body);
      return res.redirect("/signup");
    } else {
      console.log("user exist");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error is", err);
    return res.send("error");
  }
});

router.post("/create-session", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && req.body.password === user.password) {
      console.log(user);
      return res.render("welcome");
    }
    return res.redirect("back");
  } catch (err) {
    console.log("error is", err);
    return res.send("error");
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    // console.log(req.query);
    return res.redirect("/signup");
  }
);

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  async (req, res) => {
    // console.log(req.query);
    return res.redirect("/signup");
  }
);

router.get(
  "/auth/linkedIn",
  passport.authenticate("linkedin", { state: "SOME STATE" })
);
router.get(
  "/auth/linkedIn/callback",
  passport.authenticate("linkedin", { failureRedirect: "/" }),
  async (req, res) => {
    // console.log(req.query);
    return res.redirect("/signup");
  }
);

router.get("/qrcode", async (req, res) => {
  const text = req.query.text || "https://www.example.com";
  try {
    console.log(text);
    const qrCode = await qrcode.toDataURL(text);
    return res.render("qrCode", { qrcode: qrCode });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error generating QR code");
  }
});

module.exports = router;
