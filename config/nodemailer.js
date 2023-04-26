const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const nodeMailer = require("nodemailer");
const user = require("../models/user");
const smtp = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS,
  },
};
let transporter = nodeMailer.createTransport(smtp);

module.exports.sendMail = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: smtp.auth.user,
      to: params.email,
      subject: "Hello ✔",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the club.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.otp}</h1>
   </div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
