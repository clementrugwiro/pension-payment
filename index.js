const express = require("express")
const mongoose = require("mongoose")
const  bodyParser = require ('body-parser')
const  users = require ("./src/routes/users.js")
const cron = require("node-cron");
const Transaction = require("./src/models/transaction");
const User = require("./src/models/user");
const transactionRoutes = require("./src/routes/transaction");
const cors = require("cors");
const contactUs = require("./src/routes/contact.js");
require('dotenv').config()

const port = 3001

const app = express()
      app.use(cors())

app.listen(port,()=>{
    console.log("sever running at port "+ port)
})

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });
  

 const uri = 'mongodb+srv://kendymve:sNOdgCndqdDZYaYk@cluster0.mgvjffm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const uri = 'mongodb+srv://Clement:R4IwpReiIfllM8DT@cluster0.ahh6jmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(uri)
    .then(()=>{
       console.log("connected to database")
    })

// Every 3 minutes
// cron/autoPaymentJob.js

cron.schedule("*/1 * * * *", async () => {
  console.log("🔄 Checking for next auto-payment...");

  const firstTransactions = await Transaction.find({
    isFirst: true,
    status: "success",
  });

  for (const firstTx of firstTransactions) {
    const userId = firstTx.user;

    const autoTransactions = await Transaction.find({
      user: userId,
      isFirst: false,
    }).sort({ date: 1 });

    // If user has completed 5 auto-transactions, mark first as completed
    if (autoTransactions.length >= 5) {
      await Transaction.updateOne(
        { _id: firstTx._id },
        { $set: { status: "completed" } }
      );
      continue;
    }

    const now = Date.now();

    // If no auto-payments yet, check if 3 minutes have passed since firstTx.date
    if (
      autoTransactions.length === 0 &&
      now - new Date(firstTx.date).getTime() >= 3 * 60 * 1000
    ) {
      const newTx = new Transaction({
        user: userId,
        amount: firstTx.amount,
        status: "success",
        isFirst: false,
        date: new Date(),
      });
      await newTx.save();
      console.log(`✅ First auto-payment created for user ${userId}`);
    }

    // If already has some auto-payments, check 3 min since the latest
    if (
      autoTransactions.length > 0 &&
      now -
        new Date(
          autoTransactions[autoTransactions.length - 1].date
        ).getTime() >=
        3 * 60 * 1000
    ) {
      const newTx = new Transaction({
        user: userId,
        amount: firstTx.amount,
        status: "success",
        isFirst: false,
        date: new Date(),
      });
      await newTx.save();
      console.log(`✅ Auto-payment #${autoTransactions.length + 1} created for user ${userId}`);
    }
  }
});






app.use(bodyParser.json())
app.use("/api/user",users)
app.use("/api/transactions", transactionRoutes);
app.use("/api/contactus",contactUs)