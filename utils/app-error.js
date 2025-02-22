

const Const = require("../constant");
class AppError extends Error {
  constructor(message = Const.FAIL_MSG, code = Const.FAIL_CODE, statusCode = 400) {
    super(message);
    this.errorCode = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;