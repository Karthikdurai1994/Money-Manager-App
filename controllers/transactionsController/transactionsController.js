const mongoose = require("mongoose");
const Account = require("../../model/Account");
const Transaction = require("../../model/Transaction");
const appErr = require("../../utils/appErr");

// Create Transaction API Controller
const transactionCreationController = async (req, res, next) => {
  try {
    const { name, transactionType, amount, category, notes, accountID } =
      req.body;
    // Step-1: Find the Account
    // Checking whether accountID is valid or not
    if (!mongoose.Types.ObjectId.isValid(accountID)) {
      const invalidAccountIDError = appErr("Invalid Account ID format", 400);
      return next(invalidAccountIDError);
    }
    const accountFound = await Account.findById(accountID);

    if (!accountFound) {
      const accountNotFound = appErr("No Account is found", 404);
      return next(accountNotFound);
    }
    // Step-2: Create Transaction
    const transaction = await Transaction.create({
      name,
      transactionType,
      amount,
      category,
      createdBy: req.user,
      notes,
    });
    // Step-3: Push the transactionID inside  account's transaction array
    accountFound.transactions.push(transaction._id);
    // Step-4: Resave the accounts
    await accountFound.save();
    // Step-5: Send the response to the user
    res.json({
      status: "Success",
      message: transaction,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Fetch All Transactions API Controller
const fetchAllTransactionsController = async (req, res, next) => {
  try {
    // Step - 1: Fetch all transaction created by the user
    const transactionsFound = await Transaction.find({ createdBy: req.user });
    if (transactionsFound.length === 0) {
      const transactionNotFoundErrorObj = appErr(
        "No Transactions recorded",
        404
      );
      return next(transactionNotFoundErrorObj);
    }
    // Step - 2: Send the response to the front-end
    res.status(200).json({
      status: "Success",
      message: transactionsFound,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Fetch Single Transaction API Controller
const fetchSingleTransactionController = async (req, res, next) => {
  try {
    // Step-1: Fetch the single transaction with ID from the database
    const { id } = req.params;
    // Checking whether transaction ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const invalidAccountIDError = appErr(
        "Invalid Transaction ID format",
        400
      );
      return next(invalidAccountIDError);
    }
    const fetchSingleTransaction = await Transaction.findById(id);
    if (!fetchSingleTransaction) {
      const fetchSingleTransactionNotFoundErrorObj = appErr(
        "No Transaction found",
        404
      );
      return next(fetchSingleTransactionNotFoundErrorObj);
    }
    res.status(200).json({
      status: "Success",
      message: fetchSingleTransaction,
    });
    // Step-2: Send the response to the front-end
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Update Single Transaction API Controller
const updateSingleTransactionController = async (req, res, next) => {
  try {
    // Step-1: Finf the transaction by "transaction ID" and update the transaction detail
    const { id } = req.params;
    // Checking whether transaction ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const invalidAccountIDError = appErr(
        "Invalid Transaction ID format",
        400
      );
      return next(invalidAccountIDError);
    }
    const updateSingleTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updateSingleTransaction) {
      const updateSingleTransactionNotFoundErrorObj = appErr(
        "No Transaction found",
        404
      );
      return next(updateSingleTransactionNotFoundErrorObj);
    }
    // Step-2: Send the response to the user
    res.status(200).json({
      status: "Success",
      message: updateSingleTransaction,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Delete Single Transactions API Controller
const deleteSingleTransactionController = async (req, res, next) => {
  try {
    // Step-1: Finf the transaction by "transaction ID" and update the transaction detail
    const { id } = req.params;
    // Checking whether transaction ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const invalidAccountIDError = appErr(
        "Invalid Transaction ID format",
        400
      );
      return next(invalidAccountIDError);
    }
    const deleteSingleTransaction = await Transaction.findByIdAndDelete(id);
    if (!deleteSingleTransaction) {
      const deleteSingleTransactionNotFoundErrorObj = appErr(
        "No Transaction found",
        404
      );
      return next(deleteSingleTransactionNotFoundErrorObj);
    }
    // Step-2: Send the response to the user
    res.status(200).json({
      status: "Success",
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

module.exports = {
  transactionCreationController,
  fetchAllTransactionsController,
  fetchSingleTransactionController,
  updateSingleTransactionController,
  deleteSingleTransactionController,
};
