const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hasCreatedAccount: {
      // This is used to track the accounts created by the user
      type: Boolean,
    },
    accounts: [
      // This is used to store the array of accounts [only account ID] created by the user. "Accouts Data" will be fetched from "Account" model
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account", // This refers the Account model
      },
    ],
  },
  {
    timestamps: true, // used to include timestamps like "createdAt", "updatedAt"
    toJSON: { virtuals: true }, // toJSON - when used "toJSON" after fetching model data, virtuals properties will be included or else only we can use them and cannot include it automatically but manually have to include. Refer - https://chat.openai.com/share/16e8a1cf-0b76-49be-861d-4c7cc5469051
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
