// This is global error handler middleware

const globalErrorHandler = (err, req, res, next) => {
  // Getting error status code
  const errorStatusCode = err.statusCode || 500;

  // Getting error status
  const errorStatus = err.status || "Error";

  // Getting error message
  const errorMessage = err.message;

  // Sending Error response to front end
  res.status(errorStatusCode).json({
    status: errorStatus,
    message: errorMessage,
  });
};

module.exports = globalErrorHandler;
