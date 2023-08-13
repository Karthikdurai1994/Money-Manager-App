// This is used to generate JSON Web Tokens

const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_TOKEN_SECRET_KEY, {
    expiresIn: "10d",
  }); // Here JSON Web Tokens is generated with 10 days validity after that it will expire
  return token;
};

module.exports = generateToken;
