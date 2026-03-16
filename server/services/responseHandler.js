const successRes = (
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

module.exports = successRes;
