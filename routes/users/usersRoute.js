const express = require("express");
const usersRouter = express.Router();
const isLogin = require("../../middlewares/isLogin");

// Getting userController
const {
  userRegisterController,
  userLoginController,
  userProfileViewController,
  userProfileUpateController,
  userProfileDeleteController,
} = require("../../controllers/usersController/usersController");

// Users Route API Base URL - "/api/v1/users"
// User Register API: POST -> "/register"
usersRouter.post("/register", userRegisterController);

// User Login API: POST -> "/login"
usersRouter.post("/login", userLoginController);

// User Profile View API: GET -> "/profile"
usersRouter.get("/profile", isLogin, userProfileViewController);

// User Profile Update API: PUT -> "/:id"
usersRouter.put("/", isLogin, userProfileUpateController);

// User Profile Delete API: DELETE -> "/:id"
usersRouter.delete("/", isLogin, userProfileDeleteController);

module.exports = usersRouter;
