/** @format */

class ExpressError extends Error {
  constructor(statuscode, message) {
    super(message);
    this.statusCode = statuscode;
    this.message = message;
  }
}
module.exports = ExpressError;
