const express = require("express");
const User = require("../models/user");
const router = express.Router();
const qrcode = require("qrcode");
//const logger = require("lo");
const passport = require("passport");
const { otpGenerator } = require("../config/otp");
const sendMail = require("../config/nodemailer");
const json = require("body-parser/lib/types/json");
router.get("/", (req, res) => {
  return res.render("index");
});

router.get("/verify/:email", (req, res) => {
  //res.send(req.user);
  return res.render("verify_email", { email: req.params.email });
});

router.get("/signin", (req, res) => {
  return res.render("signIn");
});
router.get("/welcome", async (req, res) => {
  return res.render("welcome");
});
router.post("/verify/:id", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.id });
    if (!user) {
      return res.send("user is undefined");
    }
    if (user && req.body.otp !== user.otp) {
      return res.send("Invalid OTP");
    }

    return res.redirect(`/qrcode/${user._id}`);
  } catch (err) {
    res.send(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    const otp = otpGenerator();
    console.log(otp);
    if (req.body.password !== req.body.confirmPassword) {
      return res.redirect("back");
    }
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      await User.create({
        ...req.body,
        otp: otp,
      });
      await sendMail.sendMail({ email: req.body.email, otp: otp });
      return res.redirect(`/verify/${req.body.email}`);
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
      return res.redirect(`/qrcode/${user._id}`);
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

router.get("/qrcode/:id", async (req, res) => {
  //res.send(stringText);
  // const text = req.params || "https://www.example.com";
  // res.send(text);
  // const stringText = JSON.stringify(text);
  try {
    const user = await User.findById(req.params.id);
    const stringText = JSON.stringify(user);
    const qrCode = await qrcode.toDataURL(stringText);
    res.render("qrCode", { qrcode: qrCode });
  } catch (err) {
    return res.status(500).send("Error generating QR code");
  }
});

module.exports = router;
