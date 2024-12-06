const { User } = require("../models");
const { generateHashedPassword } = require("./encrypt.service");
const {
  validateNewUserInputSchema,
  validateLoginInputSchema,
} = require("./auth.validation.service");
const {
  getUserByEmailOrPhoneNumber,
  createNewUser,
  createNewCalendar,
  connectUserWithCalendar,
  getUserByPhoneNumber,
  removeRefreshTokenFromDatabaseByUserId,
  removeRefreshTokenFromDatabaseByTokenString,
  checkIfRefreshTokenExistsByTokenString,
} = require("../repositories/auth.repository");
const logger = require("../logger");
const { NotExistsError } = require("../errors");
const { saveKakaoUserInfo } = require("../repositories/passport.repository");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.json").SERVER;

const validateRegisterInputService = (data) => {
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

const validateLoginInputService = (data) => {
  const valid = validateLoginInputSchema(data);
  if (!valid) {
    return {
      isValid: false,
      errors: validateLoginInputSchema.errors,
    };
  }
  return {
    isValid: true,
    errors: null,
  };
};

const createNewUserService = async (user) => {
  const newUser = {
    name: user.name,
    nickname: user.nickname,
    password: user.password,
    birthdate: user.birthdate,
    phone_number: user.phone_number,
    email: user.email,
    profile_image: user.profile_image,
  };
  logger.debug(
    `[createNewUserService] 새로운 사용자 생성: ${JSON.stringify(newUser, null, 2)}`
  );
  newUser.password = await generateHashedPassword(newUser.password);
  logger.debug(`[createNewUserService] 암호화된 비밀번호: ${newUser.password}`);
  const createdUser = await createNewUser(newUser);
  logger.debug(
    `[createNewUserService] 새로운 사용자 생성: ${JSON.stringify(createdUser, null, 2)}`
  );
  return createdUser;
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

const checkDuplicateUserService = async (email, phoneNumber) => {
  const result = await getUserByEmailOrPhoneNumber(email, phoneNumber);

  return result;
};

const createCalendarForNewUserService = async (userId) => {
  const calendar = await createNewCalendar();
  const userCalendar = await connectUserWithCalendar(
    userId,
    calendar.calendar_id
  );

  return userCalendar;
};

const getUserInfoService = async (loginId, password) => {
  const user = await getUserByPhoneNumber(loginId);
  if (!user) {
    throw new NotExistsError("가입되지 않은 사용자입니다.");
  }
  return user;
};

const saveKakaoUserInfoService = async (kakaoUserInfo) => {
  const { kakao_id, email, nickname, profile_image } = kakaoUserInfo;

  const result = await saveKakaoUserInfo({
    kakao_id,
    email,
    nickname,
    profile_image,
  });

  return result;
};

const checkIfTokenIsValidService = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { isValid: true, decoded };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

const removeRefreshTokenFromDatabaseByUserIdService = async (userId) => {
  const result = await removeRefreshTokenFromDatabaseByUserId(userId);

  return result;
};

const removeRefreshTokenFromDatabaseByTokenStringService = async (token) => {
  const result = await removeRefreshTokenFromDatabaseByTokenString(token);

  return result;
};

const checkIfRefreshTokenExistsByTokenStringService = async (token) => {
  const result = await checkIfRefreshTokenExistsByTokenString(token);

  return result;
};

module.exports = {
  validateRegisterInputService,
  validateLoginInputService,
  createTestUserService,
  checkDuplicateUserService,
  createNewUserService,
  createCalendarForNewUserService,
  getUserInfoService,
  saveKakaoUserInfoService,
  checkIfTokenIsValidService,
  removeRefreshTokenFromDatabaseByUserIdService,
  removeRefreshTokenFromDatabaseByTokenStringService,
  checkIfRefreshTokenExistsByTokenStringService,
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
