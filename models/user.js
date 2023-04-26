const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
    },
    lastActive: {
      type: String,
      required: false,
    },
    active: {
      type: String,
      default: false,
    },
    id: {
      type: String,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
