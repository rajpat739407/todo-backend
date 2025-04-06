const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  confirmPassword: { type: String, required: true, minLength: 8 },
  resetToken: String,
  resetTokenExpiration: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
