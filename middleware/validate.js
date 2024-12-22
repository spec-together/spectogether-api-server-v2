const { InvalidInputError } = require("../errors");

const validate = (schema) => {
  return (req, res, next) => {
    const valid = schema(req.body);
    if (!valid) {
      const errorDetails = schema.errors.map((err) => ({
        instancePath: err.instancePath,
        message: err.message,
      }));
      return next(
        new InvalidInputError("유효하지 않은 입력입니다.", errorDetails)
      );
    }
    next();
  };
};

module.exports = validate;
