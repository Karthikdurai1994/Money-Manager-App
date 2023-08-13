// This is our backend server file for Income Expense Tracker Application

const express = require("express");
const app = express();
const usersRoute = require("./routes/users/usersRoute");
const accountsRoute = require("./routes/accounts/accountsRoute");
const transactionsRoute = require("./routes/transactions/transactionsRoute");
const mongoDBConnection = require("./config/mongoDBConnection");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
require("dotenv").config();

// Connecting to MongoDB Database
mongoDBConnection();

// Middlewares
app.use(express.json()); // Middleware for accepting "re.body" sent from front-end

// Routes
// There are 3 main route handlers for  "users", "account", "transactions"

// 1.Users API - Here "usersRoute" routing file is added
app.use("/api/v1/users", usersRoute);

// 2. Accounts API - Here "accountsRoute" routing file is added
app.use("/api/v1/accounts", accountsRoute);

// 3. Transactions API - "transactionsRoute" routing file is added
app.use("/api/v1/transactions", transactionsRoute);

// Error Handlers
app.use(globalErrorHandler); // Using globalErrorHandler for handling error. This must be placed after all routes

// Listening to Server
const port = process.env.BACKEND_SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});
