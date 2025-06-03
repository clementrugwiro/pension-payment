const express = require("express")
const mongoose = require("mongoose")
const  bodyParser = require ('body-parser')
const  users = require ("./src/routes/users.js")
const cron = require("node-cron");
const Transaction = require("./src/models/transaction");
const User = require("./src/models/user");
const transactionRoutes = require("./src/routes/transaction");



const port = 3001

const app = express()

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
  
    const firstPaidUsers = await Transaction.distinct("user", {
      isFirst: true,
      status: "success",
    });
  
    for (const userId of firstPaidUsers) {
      const autoTx = new Transaction({
        user: userId,
        amount: 1000, // fixed or from plan
        status: "success",
        isFirst: false,
      });
  
      await autoTx.save();
      console.log(`✅ Auto-payment created for user ${userId}`);
    }
  });

app.use(bodyParser.json())
app.use("/api/user",users)
app.use("/api/transactions", transactionRoutes);