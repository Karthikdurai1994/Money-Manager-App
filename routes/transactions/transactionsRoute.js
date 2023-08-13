const express = require("express");
const transactionsRoute = express.Router();

// Getting transactionController
const {
  transactionCreationController,
  fetchAllTransactionsController,
  fetchSingleTransactionController,
  updateSingleTransactionController,
  deleteSingleTransactionController,
} = require("../../controllers/transactionsController/transactionsController");
const isLogin = require("../../middlewares/isLogin");

// Tranaction API Base URL - "/api/v1/transactions"
// Create Transaction API: POST -> "/"
transactionsRoute.post("/", isLogin, transactionCreationController);

// Fetch All Transactions API: GET -> "/"
transactionsRoute.get("/", isLogin, fetchAllTransactionsController);

// Fetch Single Transaction API: GET -> "/:id"
transactionsRoute.get("/:id", isLogin, fetchSingleTransactionController);

// Update Single Transaction API: PUT -> "/:id"
transactionsRoute.put("/:id", isLogin, updateSingleTransactionController);

// Delete Single Transactions API: DELETE -> "/:id"
transactionsRoute.delete("/:id", isLogin, deleteSingleTransactionController);

module.exports = transactionsRoute;
