const {
  User,
  EmailVerificationCode,
  Calendar,
  UserCalendar,
  Term,
  UserTerm,
  UserRefreshToken,
} = require("../../models");
const { generateHashedPassword } = require("../../utils/encrypt.util");
const authValidator = require("../../utils/validators/auth.validators");
const logger = require("../../logger");
const {
  NotExistsError,
  NotAllowedError,
  DatabaseError,
  AlreadyExistsError,
  InvalidInputError,
  UnauthorizedError,
} = require("../../errors");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config.json").SERVER;

/**
 * 사용자 등록 입력값을 검증하는 서비스 함수.
 * @param {Object} data - 검증할 사용자 입력 데이터.
 * @throws {InvalidInputError} 유효하지 않은 입력값인 경우 오류를 발생시킵니다.
 * @returns {Object} 검증 결과 객체. 유효한 경우 isValid는 true이고 errors는 null입니다.
 */
const validateRegisterInput = (data) => {
  const valid = authValidator.validateNewUserInputSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: authValidator.validateNewUserInputSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

/**
 * 사용자 로그인 입력값을 검증하는 서비스 함수.
 * @param {Object} data - 검증할 로그인 입력 데이터.
 * @throws {InvalidInputError} 유효하지 않은 입력값인 경우 오류를 발생시킵니다.
 * @returns {Object} 검증 결과 객체. 유효한 경우 isValid는 true이고 errors는 null입니다.
 */
const validateLoginInput = (data) => {
  const valid = authValidator.validateLoginInputSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: authValidator.validateLoginInputSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

/**
 * 이메일 인증 ID로 이메일을 조회하는 서비스 함수.
 * @param {string} emailVerificationId - 조회할 이메일 인증 ID.
 * @throws {InvalidInputError} 해당 ID에 대한 이메일이 존재하지 않을 경우 오류를 발생시킵니다.
 * @returns {Object} 조회된 이메일 인증 레코드.
 */
const getEmailByEmailVerificationId = async (emailVerificationId) => {
  const email = await EmailVerificationCode.findByPk(emailVerificationId);
  logger.debug(
    `[getEmailByEmailVerificationId] email: ${JSON.stringify(email, null, 2)}`
  );

  if (!email) {
    throw new InvalidInputError("인증된 이메일이 아닙니다.");
  }
  return email;
};

/**
 * 새 사용자를 생성하는 서비스 함수.
 * @param {Object} user - 생성할 사용자 정보.
 * @throws {DatabaseError} 사용자 생성에 실패한 경우 오류를 발생시킵니다.
 * @returns {Object} 생성된 사용자 정보.
 */
const createNewUser = async (user) => {
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
    `[createNewUser] 새로운 사용자 생성: ${JSON.stringify(newUser, null, 2)}`
  );

  newUser.password = await generateHashedPassword(newUser.password);
  logger.debug(`[createNewUser] 암호화된 비밀번호: ${newUser.password}`);

  const createdUser = await User.create(newUser);
  logger.debug(
    `[createNewUser] 새로운 사용자 생성: ${JSON.stringify(createdUser, null, 2)}`
  );
  return createdUser;
};

/**
 * 테스트용 사용자를 생성하는 서비스 함수.
 * @param {string} name - 사용자의 이름.
 * @param {string} email - 사용자의 이메일.
 * @param {string} phoneNumber - 사용자의 전화번호.
 * @throws {DatabaseError} 테스트 사용자 생성에 실패한 경우 오류를 발생시킵니다.
 * @returns {Object} 생성된 테스트 사용자 정보.
 */
const createTestUser = async (name, email, phoneNumber) => {
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
  if (!newUser) throw new DatabaseError("테스트 유저 생성에 실패했습니다.");

  return newUser;
};

/**
 * 이메일 또는 전화번호의 중복 여부를 확인하는 서비스 함수.
 * @param {string} email - 확인할 이메일 주소.
 * @param {string} phoneNumber - 확인할 전화번호.
 * @throws {AlreadyExistsError} 이메일 또는 전화번호가 이미 존재하는 경우 오류를 발생시킵니다.
 * @returns {Object|null} 중복된 사용자 정보 또는 null.
 */
const checkDuplicateUser = async (email, phoneNumber) => {
  logger.debug(
    `[checkDuplicateUser] email: ${email}, phoneNumber: ${phoneNumber}`
  );
  const result = await User.findOne({
    attributes: ["user_id"],
    where: {
      [Sequelize.Op.or]: [{ email }, { phone_number: phoneNumber }],
    },
  });

  if (result) {
    throw new AlreadyExistsError({
      message: "이미 존재하는 사용자입니다.",
      data: result, // TODO: production에서는 지워야 합니다?
    });
  }

  return result;
};

/**
 * 새 사용자에게 캘린더를 생성하는 서비스 함수.
 * @param {string} userId - 캘린더를 생성할 사용자의 ID.
 * @throws {DatabaseError} 캘린더 생성에 실패한 경우 오류를 발생시킵니다.
 * @returns {Object} 생성된 사용자 캘린더 정보.
 */
const createCalendarForNewUser = async (userId) => {
  const calendar = await Calendar.create();
  const userCalendar = await UserCalendar.create({
    user_id: userId,
    calendar_id: calendar.calendar_id,
  });

  return userCalendar;
};

/**
 * 로그인 ID와 비밀번호로 사용자 정보를 조회하는 서비스 함수.
 * @param {string} loginId - 로그인에 사용할 사용자 ID (전화번호).
 * @param {string} password - 사용자 비밀번호.
 * @throws {NotExistsError} 사용자가 존재하지 않거나 비밀번호가 일치하지 않을 경우 오류를 발생시킵니다.
 * @returns {Object} 조회된 사용자 정보.
 */
const getUserInfo = async (loginId, password) => {
  const user = await User.findOne({
    attributes: ["user_id", "name", "nickname", "password"],
    where: {
      phone_number: loginId,
    },
  });
  if (!user) {
    throw new NotExistsError("가입되지 않은 사용자입니다.");
  }
  return user;
};

// deprecated
// 졸다가 만든 함수라 삭제해야함
// const saveKakaoUserInfo = async (kakaoUserInfo) => {
//   const { kakao_id, email, nickname, profile_image } = kakaoUserInfo;

//   const result = await saveKakaoUserInfo({
//     kakao_id,
//     email,
//     nickname,
//     profile_image,
//   });

//   return result;
// };

/**
 * JWT 토큰의 유효성을 검증하는 서비스 함수.
 * @param {string} token - 검증할 JWT 토큰.
 * @throws {NotAllowedError} 토큰이 유효하지 않거나 만료된 경우 오류를 발생시킵니다.
 * @returns {Object} 토큰이 유효한 경우 디코딩된 토큰 정보.
 */
const checkIfTokenIsValid = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { isValid: true, decoded };
  } catch (error) {
    throw new NotAllowedError("유효하지 않은 토큰입니다.");
  }
};

// deprecated
// const removeRefreshTokenFromDatabaseByUserId = async (userId) => {
//   const result = await removeRefreshTokenFromDatabaseByUserId(userId);

//   return result;
// };

/**
 * 리프레시 토큰 문자열로 데이터베이스에서 해당 토큰을 삭제하는 서비스 함수.
 * @param {string} token - 삭제할 리프레시 토큰 문자열.
 * @throws {NotExistsError} 해당 토큰이 데이터베이스에 존재하지 않을 경우 오류를 발생시킵니다.
 * @returns {number} 삭제된 토큰의 수.
 */
const removeRefreshTokenFromDatabaseByTokenString = async (token) => {
  const result = await UserRefreshToken.destroy({
    where: {
      refresh_token: token,
    },
  });
  if (result === 0) {
    throw new NotExistsError("존재하지 않는 RT 입니다.");
  }
  logger.debug(
    `[removeRefreshTokenFromDatabaseByTokenString] 로그아웃 성공, ${result}개의 refresh token이 삭제되었습니다.`
  );
  return result;
};

/**
 * 리프레시 토큰 문자열로 해당 토큰이 존재하는지 확인하는 서비스 함수.
 * @param {string} token - 확인할 리프레시 토큰 문자열.
 * @throws {NotExistsError} 해당 토큰이 데이터베이스에 존재하지 않을 경우 오류를 발생시킵니다.
 * @returns {Object} 존재하는 리프레시 토큰 정보.
 */
const checkIfRefreshTokenExistsByTokenString = async (token) => {
  const result = await UserRefreshToken.findOne({
    where: {
      refresh_token: token,
    },
  });

  if (!result) {
    throw new NotExistsError("존재하지 않는 RT 입니다.");
  }

  return result;
};

/**
 * 요청 쿠키에서 리프레시 토큰을 확인하고 반환하는 서비스 함수.
 * @param {Object} req - Express 요청 객체.
 * @throws {UnauthorizedError} 리프레시 토큰이 요청에 존재하지 않을 경우 오류를 발생시킵니다.
 * @returns {string} 요청 쿠키에 존재하는 리프레시 토큰 문자열.
 */
const checkAndReturnRefreshTokenIfExistsInRequestCookie = (req) => {
  const refreshToken = req.cookies.SPECTOGETHER_RT;
  if (!refreshToken) {
    throw new UnauthorizedError("로그인 상태가 아닙니다.");
  }
  return refreshToken;
};

/**
 * 사용자가 동의한 약관을 데이터베이스에 저장하는 서비스 함수.
 * @param {string} userId - 약관을 동의할 사용자의 ID.
 * @param {Array} terms - 사용자가 동의한 약관 목록.
 * @throws {DatabaseError} 약관 동의 정보 저장에 실패한 경우 오류를 발생시킵니다.
 * @returns {void}
 */
const createUserAgreedTermsToDatabase = async (userId, terms) => {
  for (const term of terms) {
    const result = await UserTerm.create({
      term_id: term.term_id,
      user_id: userId,
      is_agreed: term.agreed,
    });
    if (!result) {
      throw new DatabaseError("약관 동의 정보 저장에 실패했습니다.");
    }
  }
  return;
};

/**
 * 현재 활성화된 약관 목록을 조회하는 서비스 함수.
 * @throws {NotExistsError} 활성화된 약관 정보가 없는 경우 오류를 발생시킵니다.
 * @returns {Array} 활성화된 약관 목록.
 */
const getCurrentTerms = async () => {
  const terms = await Term.findAll({
    attributes: ["term_id", "name", "description", "is_required"],
    where: {
      status: "active",
    },
  });
  if (!terms) {
    throw new NotExistsError("약관 정보가 없습니다.");
  }

  return terms;
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  createTestUser,
  checkDuplicateUser,
  createNewUser,
  createCalendarForNewUser,
  getUserInfo,
  // saveKakaoUserInfo, // deprecated
  checkIfTokenIsValid,
  removeRefreshTokenFromDatabaseByTokenString,
  checkIfRefreshTokenExistsByTokenString,
  checkAndReturnRefreshTokenIfExistsInRequestCookie,
  getEmailByEmailVerificationId,
  createUserAgreedTermsToDatabase,
  getCurrentTerms,
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
