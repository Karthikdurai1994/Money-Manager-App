// This middleware is used to check whether the user has logged in or not
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");
const appErr = require("../utils/appErr");

const isLogin = (req, res, next) => {
  // 1. Get token from header. For this "getTokenFromHeader.js" can be used
  const token = getTokenFromHeader(req);

  // 2. Verify Token. For this "verifyToken.js" can be used
  const decodedData = verifyToken(token);

  // 3. If token is invalid or expired or not included in header, then send error to front-end
  if (!decodedData) {
    const tokenInvalidErrorObj = appErr("Invalid Token / Token expired", 401);
    return next(tokenInvalidErrorObj);
  }

  // 4. After veritification, append the decoded token data [user id] in the req object
  req.user = decodedData.id;
  next();
};

module.exports = isLogin;
