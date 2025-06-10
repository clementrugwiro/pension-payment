const express = require("express")
const mongoose = require("mongoose")
const  bodyParser = require ('body-parser')
const  users = require ("./src/routes/users.js")
const cron = require("node-cron");
const Transaction = require("./src/models/transaction");
const User = require("./src/models/user");
const transactionRoutes = require("./src/routes/transaction");
const cors = require("cors")
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
mongoose.connect(uri)
    .then(()=>{
       console.log("connected to database")
    })

// Every 5 minutes


cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Auto-payment job running...");

  // Get users who had a successful first payment
  const firstPaidUsers = await Transaction.distinct("user", {
    isFirst: true,
    status: "success",
  });

  for (const userId of firstPaidUsers) {
    // Count the number of successful auto-payments (not first)
    const autoPaymentCount = await Transaction.countDocuments({
      user: userId,
      isFirst: false,
      status: "success",
    });

    if (autoPaymentCount < 5) {
      const autoTx = new Transaction({
        user: userId,
        amount: 1000, // fixed or based on a user's plan
        status: "success",
        isFirst: false,
      });

      await autoTx.save();
      console.log(`✅ Auto-payment #${autoPaymentCount + 1} created for user ${userId}`);
    } else {
      console.log(`⛔ User ${userId} reached auto-payment limit. They must request again.`);
      // Optional: you could notify the user or update a flag in DB here
    }
  }
});


app.use(bodyParser.json())
app.use("/api/user",users)
app.use("/api/transactions", transactionRoutes);