const cron = require("node-cron");
const Transaction = require("./src/models/transaction");
const app = require("./src/app"); // Mongoose connection already handled there
require("dotenv").config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("🚀 Server running on port", port);
});

// Cron job logic for auto-payments
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

    if (autoTransactions.length >= 5) {
      await Transaction.updateOne(
        { _id: firstTx._id },
        { $set: { status: "completed" } }
      );
      continue;
    }

    const now = Date.now();

    const shouldCreate =
      (autoTransactions.length === 0 &&
        now - new Date(firstTx.date).getTime() >= 3 * 60 * 1000) ||
      (autoTransactions.length > 0 &&
        now -
          new Date(
            autoTransactions[autoTransactions.length - 1].date
          ).getTime() >=
          3 * 60 * 1000);

    if (shouldCreate) {
      const newTx = new Transaction({
        user: userId,
        amount: firstTx.amount,
        status: "success",
        isFirst: false,
        date: new Date(),
      });
      await newTx.save();
      console.log(
        `✅ Auto-payment #${autoTransactions.length + 1} created for user ${userId}`
      );
    }
  }
});
