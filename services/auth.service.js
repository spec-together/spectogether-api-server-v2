const { User } = require("../models");
const { generateHashedPassword } = require("./encrypt.service");
const { validateNewUserInputSchema } = require("./validation.service");

const validateUserData = (data) => {
  const valid = validateNewUserInputSchema(data);
  if (!valid) {
    return {
      isValid: false,
      errors: validateNewUserInputSchema.errors,
    };
  }
  return {
    isValid: true,
    errors: null,
  };
};

const createTestUserService = async (name, email, phoneNumber) => {
  const user = {
    user_register_type: "local",
    name,
    nickname: "Johnny",
    birthdate: "1980-01-01",
    phone_number: phoneNumber,
    email,
    password: "password",
    profile_image: "binary data",
    // 원래는 email_verification_id, phone_number_verification_id 가 필요합니다.
  };
  user.password = await generateHashedPassword(user.password);
  const newUser = await User.create(user);

  return newUser;
};

module.exports = {
  validateUserData,
  createTestUserService,
};

/*
// 테스트용 사용자 데이터
const userData = {
  user_register_type: "local",
  name: "John Doe",
  nickname: "Johnny",
  birthdate: "1980-01-01",
  phone_number: "010-1111-22222",
  phone_number_verification_id: "123456",
  email: "sample@sample.com",
  email_verification_id: "123456",
  profile_image: "binary data",
  password: "password",
};
const userData2 = {
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
const result2 = validateUserData(userData2);
console.log("데이터 유효성:", result2.isValid);
if (!result.isValid) {
  console.log("오류:", JSON.stringify(result2.errors, null, 2));
}

// 그럼 오류가 다음과 같이 나와요

데이터 유효성: false
오류: [
  {
    "instancePath": "",
    "schemaPath": "#/required",
    "keyword": "required",
    "params": {
      "missingProperty": "user_register_type"
    },
    "message": "must have required property 'user_register_type'"
  }
]

*/
