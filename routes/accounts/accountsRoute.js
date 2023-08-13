const express = require("express");
const accountsRoute = express.Router();
const isLogin = require("../../middlewares/isLogin");

// Getting accountsController
const {
  accountCreationController,
  fetchAllAccountViewController,
  singleAccountUpdateController,
  singleAccountDeleteController,
  fetchSingleAccountController,
} = require("../../controllers/accountsController/accountsController");

// Accounts Routes API base URL - "/api/v1/accounts"
// Account Creation API: POST -> "/"
accountsRoute.post("/", isLogin, accountCreationController);

// Fetch All Account View API: GET -> "/"
accountsRoute.get("/", isLogin, fetchAllAccountViewController);

// Fetch Single Account View API:
accountsRoute.get("/:id", isLogin, fetchSingleAccountController);

// Single Account Update API: "/:id"
accountsRoute.put("/:id", isLogin, singleAccountUpdateController);

// Single Account Delete API: "/:id"
accountsRoute.delete("/:id", isLogin, singleAccountDeleteController);

module.exports = accountsRoute;
