const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const users = require("./routes/users.js");
const transactionRoutes = require("./routes/transaction");
const contactUs = require("./routes/contact.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/user", users);
app.use("/api/transactions", transactionRoutes);
app.use("/api/contactus", contactUs);

// Test route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// ✅ MongoDB URI and connection
const uri = process.env.MONGO_URI || 'mongodb+srv://Clement:R4IwpReiIfllM8DT@cluster0.ahh6jmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (mongoose.connection.readyState === 0) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB (from app.js)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
}

module.exports = app;
