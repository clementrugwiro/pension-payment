const mongoose = require("mongoose");

const userSchema= {
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
    dob: Date,
    nationalID: String,
    paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
  }

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
