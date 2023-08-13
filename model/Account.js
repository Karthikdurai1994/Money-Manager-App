const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: [
        // Front-end can send an one of these values mentioned in enum, if any other values sent then there will be error
        "Savings",
        "Investment",
        "Cheking",
        "Credit Card",
        "Building",
        "School",
        "Project",
        "Utilities",
        "Travel",
        "Personal",
        "Entertainment",
        "Loan",
        "Cash Flow",
        "Uncategorized",
      ],
    },
    initialBalance: {
      type: Number,
      initialBalance: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // used to include timestamps like "createdAt", "updatedAt"
    toJSON: { virtuals: true }, // // toJSON - when used "toJSON" after fetching model data, virtuals properties will be included or else only we can use them and cannot include it automatically but manually have to include. Refer - https://chat.openai.com/share/16e8a1cf-0b76-49be-861d-4c7cc5469051
  }
);

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
