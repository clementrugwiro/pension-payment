const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");
const authenticate = require("../middleware/authentication");
const authorizeNotUser = require("../middleware/authorization");

// 🟢 User creates a transaction (first time)
router.post("/", authenticate, transactionController.createTransaction);

// 👤 User gets all their transactions
router.get("/my", authenticate, transactionController.getUserTransactions);

// 🛠️ Admin/staff: get all transactions
router.get("/", authenticate, authorizeNotUser, transactionController.getAllTransactions);

// 🔍 View specific transaction by ID
router.get("/:id", authenticate, transactionController.getTransactionById);

// ✅ Admin approves a transaction
router.put("/:id/approve", authenticate, authorizeNotUser, transactionController.approveTransaction);

// ❌ Admin rejects a transaction
router.put("/:id/reject", authenticate, authorizeNotUser, transactionController.rejectTransaction);

module.exports = router;
