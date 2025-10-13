const ValidationError = require("../exceptions/ValidationError");

module.exports = async (reqBody, bodySchema) => {
  try {
    return await bodySchema.validateAsync(reqBody);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
