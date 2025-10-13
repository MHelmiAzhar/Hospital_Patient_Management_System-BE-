const ClientError = require("./ClientError");

class InternalServerError extends ClientError {
  constructor(message, errors) {
    super(message, 500, errors);
    this.name = "Internal Server Error";
  }
}

module.exports = InternalServerError;
