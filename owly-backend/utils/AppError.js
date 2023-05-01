class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.success = `${statusCode}`.startsWith("2");

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
