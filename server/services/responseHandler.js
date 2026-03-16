const responseHandler = (
  res,
  statusCode = 200,
  message = "",
  success = false,
  data = null,
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};
module.exports = { responseHandler };

const success = (
  res,
  statusCode = 200,
  messages = ["Request successful"],
  data = null,
) => {
  return res.status(statusCode).json({
    success: true,
    messages,
    ...(data && { data }),
  });
};

module.exports = { success };
