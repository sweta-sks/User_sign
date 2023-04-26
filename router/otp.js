const express = require("express");
const router = express.Router();
const { otpGenerator } = require("../config/otp");
const User = require("../models/user");
router.get("/", async (req, res) => {
  try {
    //sendMail("swetasingh7076@gmail.com");
    const otp = otpGenerator();
    console.log(otp);
    const user = await User.deleteMany({});

    res.send(user);
  } catch (err) {
    console.log("error in sending mail", err);
  }
});

module.exports = router;
