const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const newUserInputSchema = {
  type: "object",
  properties: {
    user_register_type: { type: "string", enum: ["local", "kakao"] },
    name: { type: "string" },
    nickname: { type: "string" },
    birthdate: { type: "string", format: "date" }, // 2001-12-09 와 같은 형식이여야 합니다.
    phone_number: { type: "string", pattern: "^\\d{3}-\\d{3,4}-\\d{4}$" },
    phone_number_verification_id: { type: "string" },
    email: { type: "string", format: "email" },
    email_verification_id: { type: "string" },
    profile_image: { type: "string" },
    password: { type: "string" },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term_id: { type: "integer" },
          agreed: { type: "boolean" },
        },
        required: ["term_id", "agreed"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "user_register_type",
    "name",
    "nickname",
    "birthdate",
    "phone_number",
    "phone_number_verification_id",
    "email",
    "email_verification_id",
    "password",
    "terms",
  ],
  additionalProperties: false,
};

const loginInputSchema = {
  type: "object",
  properties: {
    login_id: { type: "string", pattern: "^\\d{3}-\\d{3,4}-\\d{4}$" },
    password: { type: "string" },
  },
  required: ["login_id", "password"],
  additionalProperties: false,
};

const validateNewUserInputSchema = ajv.compile(newUserInputSchema);
const validateLoginInputSchema = ajv.compile(loginInputSchema);

module.exports = {
  validateNewUserInputSchema,
  validateLoginInputSchema,
};
