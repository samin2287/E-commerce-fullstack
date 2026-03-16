class ApiError extends Error {
  constructor(statusCode, messages = []) {
    const msgs = Array.isArray(messages) ? messages : [messages];
    super(msgs.join(", "));
    this.statusCode = statusCode;
    this.messages = msgs;
    this.success = false;
  }
}

module.exports = ApiError;
