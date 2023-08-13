const User = require("../../model/User");
const Account = require("../../model/Account");
const appErr = require("../../utils/appErr");
const mongoose = require("mongoose");

// Account Creation API Controller
const accountCreationController = async (req, res, next) => {
  try {
    // Get the data sent from front-end using "req.body"
    const { name, accountType, initialBalance, notes } = req.body;

    // Step-1: Get the loggedIn user object from database
    const userFound = await User.findById(req.user); // Here "req.user" contains userID and it is added by "isLogin" middleware file
    if (!userFound) {
      const userNotFoundErrorObj = appErr("User not found", 404);
      return next(userNotFoundErrorObj);
    }

    // Step-2: Create the account that is save it in database
    const account = await Account.create({
      name,
      accountType,
      initialBalance,
      notes,
      createdBy: req.user,
    });

    // Step-3: Push the created account's ID into user accouts array field
    userFound.accounts.push(account._id);

    // Step-4: Resave the user after pushing account ID
    await userFound.save();

    // Step-4: Send the reponse to the front-end
    res.json({
      status: "Success",
      message: {
        account,
      },
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// Fetch All Account View API Controller
const fetchAllAccountViewController = async (req, res, next) => {
  try {
    // Step-1: Get the userID from "req.user"which is added by "isLogin.js" middleware
    const userID = req.user;
    // Step-2: Fetch all accounts by the userID from the database
    const accountsFound = await Account.find({ createdBy: userID }).populate(
      // "populate" is used to expand the array data based on objectID from other model
      "transactions"
    );
    if (accountsFound.length == 0) {
      const noAccountFoundErrorObj = appErr(
        "No Accounts found for the user",
        404
      );
      return next(noAccountFoundErrorObj);
    }
    // Step-3: Send the response to the front-end
    res.json({
      status: "Success",
      message: accountsFound,
    });
  } catch (err) {
    const errObject = appErr(err, 500);
    next(errObject);
  }
};

// Single Account Fetch API Controller
const fetchSingleAccountController = async (req, res, next) => {
  try {
    // Step-1: Get the accountID from "req.params"
    const { id } = req.params;
    // Checking whether account ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const invalidAccountIDError = appErr("Invalid Account ID format", 400);
      return next(invalidAccountIDError);
    }
    // Step-2: Get the acount from database and sent it to front-end
    const accountFound = await Account.findById(id).populate("transactions");
    if (!accountFound) {
      const accountNotFoundErrorObject = appErr("Account Not found", 404);
      return next(accountNotFoundErrorObject);
    }
    res.status(200).json({
      status: "Success",
      message: accountFound,
    });
  } catch (err) {
    const errObject = appErr(err, 500);
    next(errObject);
  }
};

// Single Account Update API Controller
const singleAccountUpdateController = async (req, res, next) => {
  try {
    // Step - 1: Fetch the Account from database with "accountID" and update the found account
    const { id } = req.params;
    // Checking whether accountID is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const invalidAccountIDError = appErr("Invalid Account ID format", 400);
      return next(invalidAccountIDError);
    }
    const accountUpdate = await Account.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!accountUpdate) {
      const accountNotFoundErrorObject = appErr("Account Not found", 404);
      return next(accountNotFoundErrorObject);
    }
    // Step-2: Send the updated account response to front-end
    res.status(200).json({
      status: "Success",
      message: accountUpdate,
    });
  } catch (err) {
    const errObject = appErr(err, 500);
    next(errObject);
  }
};

// Single Account Delete API Controller
const singleAccountDeleteController = async (req, res, next) => {
  try {
    // Step - 1: Fetch the Account from database with "accountID" and delete the found account
    const { id } = req.params;
    // Checking whether account ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const invalidAccountIDError = appErr("Invalid Account ID format", 400);
      return next(invalidAccountIDError);
    }
    const accountDeleted = await Account.findByIdAndDelete(id);
    if (!accountDeleted) {
      const accountNotFoundErrorObject = appErr("Account Not found", 404);
      return next(accountNotFoundErrorObject);
    }
    res.status(200).json({
      status: "Success",
      message: "Account Deleted Successfully",
    });
    // Step-2: Send the updated account response to front-end
  } catch (err) {
    const errObject = appErr(err, 500);
    next(errObject);
  }
};

module.exports = {
  accountCreationController,
  fetchAllAccountViewController,
  fetchSingleAccountController,
  singleAccountUpdateController,
  singleAccountDeleteController,
};
