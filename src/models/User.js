const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: { type: "string", unique: true },
  password: "string",
  picture: "string",
});

const User = mongoose.model("User", schema);

module.exports = User;
