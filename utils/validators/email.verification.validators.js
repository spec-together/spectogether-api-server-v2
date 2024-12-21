const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allError: true });
addFormats(ajv);

const checkEmailUniqueSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
};

const sendVerificationEmailSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
};

const verifyEmailSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    code: { type: "string" },
  },
  required: ["email", "code"],
  additionalProperties: false,
};

const validateCheckEmailUnique = ajv.compile(checkEmailUniqueSchema);
const validateSendVerificationEmail = ajv.compile(sendVerificationEmailSchema);
const validateVerifyEmail = ajv.compile(verifyEmailSchema);

module.exports = {
  validateCheckEmailUnique,
  validateSendVerificationEmail,
  validateVerifyEmail,
};
