class ApiError extends Error {
  constructor(statusCode, messages = []) {
    super();
    this.statusCode = statusCode;
    this.messages = Array.isArray(messages) ? messages : [messages];
    this.success = false;
  }
}

module.exports = ApiError;
