const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");

module.exports.otpGenerator = () => {
  const otp = otpGenerator.generate("6", {
    digits: true,
  });
  return otp;
};
