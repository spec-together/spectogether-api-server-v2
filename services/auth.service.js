const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = {
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
  ],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

function validateUserData(data) {
  const valid = validate(data);
  if (!valid) {
    return {
      isValid: false,
      errors: validate.errors,
    };
  }
  return {
    isValid: true,
    errors: null,
  };
}

// 테스트용 사용자 데이터
const userData = {
  user_register_type: "local",
  name: "John Doe",
  nickname: "Johnny",
  birthdate: "1980-01-01",
  phone_number: "010-1111-2222",
  phone_number_verification_id: "123456",
  email: "sample@sample.com",
  email_verification_id: "123456",
  profile_image: "binary data",
  password: "password",
};

const result = validateUserData(userData);
console.log("데이터 유효성:", result.isValid);
if (!result.isValid) {
  console.log("오류:", JSON.stringify(result.errors, null, 2));
}
