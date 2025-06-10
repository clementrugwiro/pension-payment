const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authenticate = require("../middleware/authentication");
const authorizeNotUser = require("../middleware/authorization");
const upload = require('../middleware/upload');


// Routes

// Get all users (admin use)
router.get("/",authenticate, authorizeNotUser, userController.getAllUsers);

// Register a new user
router.post("/register", upload.single('image'), userController.registerUser);

// Login user
router.post("/login", userController.loginUser);


// Get user profile by ID
router.get("/:id",authenticate, authorizeNotUser, userController.getUserById);



// Update user info
router.put("/:id",authenticate, authorizeNotUser, userController.updateUser);

// Delete user (admin)
router.delete("/:id",authenticate, authorizeNotUser, userController.deleteUser);

module.exports = router;
