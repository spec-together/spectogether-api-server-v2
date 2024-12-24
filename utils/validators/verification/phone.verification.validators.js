const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const checkPhoneUniqueSchema = {
  type: "object",
  properties: {
    phone_number: { type: "string", pattern: "^0\\d{9,10}$" },
  },
  required: ["phone_number"],
  additionalProperties: false,
};

const sendTokenToPhoneSchema = {
  type: "object",
  properties: {
    phone_number: { type: "string", pattern: "^0\\d{9,10}$" },
  },
  required: ["phone_number"],
  additionalProperties: false,
};

const verifyTokenSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    token: { type: "string", pattern: "^\\d{6}$" },
  },
  required: ["id", "token"],
  additionalProperties: false,
};

const validateCheckPhoneUniqueSchema = ajv.compile(checkPhoneUniqueSchema);
const validateSendTokenToPhoneSchema = ajv.compile(sendTokenToPhoneSchema);
const validateVerifyTokenSchema = ajv.compile(verifyTokenSchema);

module.exports = {
  validateCheckPhoneUniqueSchema,
  validateSendTokenToPhoneSchema,
  validateVerifyTokenSchema,
};
