const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    messages: err.messages || ["Internal Server Error"],
  });
};

module.exports = errorHandler;
