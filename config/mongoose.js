const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/login_pages");
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error in Database"));
db.once("open", function () {
  console.log(" Connected to Database :: MongoDB");
});

module.exports = db;
