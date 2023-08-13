const appErr = (message, statusCode) => {
  // Creating Error object
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = "failed";
  return error;
};

module.exports = appErr;
