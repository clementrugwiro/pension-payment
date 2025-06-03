// models/transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "success", "rejected"], default: "pending" },
  isFirst: { type: Boolean, default: false },
});

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
