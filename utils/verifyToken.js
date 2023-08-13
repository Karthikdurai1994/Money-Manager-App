// This is used to verify json web token we get from front-end
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (token) => {
  // Verifying JSON web tokens sent from front-end
  const tokenVerifyResult = jwt.verify(
    token,
    process.env.JWT_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return false;
      } else {
        return decoded;
      }
    }
  );
  return tokenVerifyResult;
};

module.exports = verifyToken;
