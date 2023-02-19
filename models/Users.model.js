const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  gender: { type: String },
  pass: { type: String, unique: true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
