const validate = (schema) => {
  return (req, res, next) => {
    const valid = schema(req.body);
    if (!valid) {
      return res.status(400).json({ errors: schema.errors });
    }
    next();
  };
};

module.exports = validate;
