const Transaction = require("../models/transaction");
const User = require("../models/user");
const mongoose = require("mongoose");

// User initiates a transaction if none are pending or auto-paying
exports.createTransaction = async (req, res) => {
  try {
    const hasOngoing = await Transaction.exists({
      user: req.user.userId,
      isFirst: true,
      status: { $in: ["pending", "success"] },
    });
    console.log("Checking for ongoing transactions:", hasOngoing);
    if (hasOngoing) {
      return res.status(400).json({ message: "You already have a pending or active transaction." });
    }

    const newTransaction = new Transaction({
      user: req.user.userId,
      amount: 0,
      status: "pending",
      isFirst: true,
    });

    await newTransaction.save();
    
    res.status(201).json({ message: "Transaction request submitted", transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ message: "Error creating transaction", error: err.message });
  }
};

// 👤 User gets all their transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user transactions", error: err.message });
  }
};

// 🛠️ Admin/staff: get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "-password -__v") // populate user details except sensitive
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all transactions", error: err.message });
  }
};

// 🔍 View specific transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).json({ message: "Invalid transaction ID" });

    const transaction = await Transaction.findById(id).populate("user", "-password -__v");

    if (!transaction) 
      return res.status(404).json({ message: "Transaction not found" });

    // Optional: only user who owns transaction or admin can view
    if (transaction.user._id.toString() !== req.user.userId && req.user.role === "user") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transaction", error: err.message });
  }
};

// ✅ Admin approves a transaction
exports.approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid transaction ID" });

    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (transaction.status === "success")
      return res.status(400).json({ message: "Transaction already approved" });

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({ message: "Valid amount is required" });

    // Approve original request
    transaction.amount = amount;
    transaction.status = "success";
    await transaction.save();


    res.status(200).json({ message: "Transaction approved and auto-payments created", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error approving transaction", error: err.message });
  }
};


// ❌ Admin rejects a transaction
exports.rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid transaction ID" });

    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (transaction.status === "rejected") {
      return res.status(400).json({ message: "Transaction already rejected" });
    }

    transaction.status = "rejected";
    await transaction.save();

    res.status(200).json({ message: "Transaction rejected", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting transaction", error: err.message });
  }
};




  