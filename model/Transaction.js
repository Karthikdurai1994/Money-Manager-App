const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["Income", "Expenses"],
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Transportation",
        "Entertainment",
        "Shopping",
        "Utilities",
        "Health",
        "Travel",
        "Education",
        "Personal",
        "Groceries",
        "Bills",
        "Uncategorized",
      ],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: {
      // This is used to record transaction data
      type: Date,
      default: Date.now(),
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // used to include timestamps like "createdAt", "updatedAt"
    toJSON: { virtuals: true }, // toJSON - when used "toJSON" after fetching model data, virtuals properties will be included or else only we can use them and cannot include it automatically but manually have to include. Refer - https://chat.openai.com/share/16e8a1cf-0b76-49be-861d-4c7cc5469051
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
