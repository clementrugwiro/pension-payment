const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
  dob: Date,
  nationalID: String,
  profilePictureUrl: String,
  paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  lastLogin: Date // ✅ Track last login
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
