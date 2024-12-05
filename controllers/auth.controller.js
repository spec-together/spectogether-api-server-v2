const { DatabaseError } = require("sequelize");
const {
  createTestUserService,
  validateUserDataService,
  checkDuplicateUserService,
  createNewUserService,
  createCalendarForNewUserService,
} = require("../services/auth.service");
const logger = require("../logger");
const { InvalidInputError, AlreadyExistsError } = require("../errors");
const { decrypt62 } = require("../services/encrypt.service");
const {
  getEmailByEmailVerificationId,
} = require("../repositories/auth.repository");

const handleUserRegister = async (req, res, next) => {
  /*
  1. 데이터 검증
  2. 이미 존재하는 사용자인지 확인 ( key = email )
  3. email verification id에 등록된 email과 일치하는지 확인
  4. spec_level, manner_level, role, is_active 는 default로 생성
  5. calendar 생성, user_calendar 연결
  6. todo는 나중에 테이블에 쿼리 떄릴거임
  */
  try {
    const newUserData = req.body;
    // 데이터 검증
    logger.debug(`[handleUserRegister] 데이터 검증`);
    const validation = validateUserDataService(newUserData);
    if (!validation.isValid) {
      throw new InvalidInputError({
        error: validation.errors,
        message: "입력값이 올바르지 않습니다.",
      });
    }
    // 중복 사용자 확인
    logger.debug(`[handleUserRegister] 중복 사용자 확인`);
    const isDuplicateUser = await checkDuplicateUserService(
      newUserData.email,
      newUserData.phone_number
    );
    if (isDuplicateUser) {
      throw new AlreadyExistsError({
        message: "이미 존재하는 사용자입니다.",
        data: isDuplicateUser,
      });
    }
    // email verification id 확인
    logger.debug(`[handleUserRegister] email verification id 확인`);
    const emailVerifyId = decrypt62(newUserData.email_verification_id);
    const isVerifiedEmail = await getEmailByEmailVerificationId(emailVerifyId);
    if (!isVerifiedEmail) {
      throw new InvalidInputError({
        message: "인증된 이메일이 아닙니다.",
      });
    }

    // 사용자 생성
    logger.debug(`[handleUserRegister] 사용자 생성`);
    const newUser = await createNewUserService(newUserData);

    // 캘린더 생성 및 user_calendar에 연결
    logger.debug(`[handleUserRegister] 캘린더 생성 및 user_calendar에 연결`);
    const newCalendar = await createCalendarForNewUserService(newUser.user_id);

    return res.status(201).success({
      message: "사용자 생성에 성공했습니다.",
    });
  } catch (error) {
    logger.error(`[handleUserRegister] ${JSON.stringify(error, null, 2)}`);
    next(error);
  }
};

// 테스트 유저 생성을 위한 API 입니다, 실제 서비스에서는 사용되지 않습니다.
// 각종 검증 과정을 생략하고 유저를 바로 생성해줍니다.
const handleCreateTestUser = async (req, res, next) => {
  try {
    const { name, email, phone_number } = req.body;
    const newUser = await createTestUserService(name, email, phone_number);
    if (!newUser) throw new DatabaseError("테스트 유저 생성에 실패했습니다.");
    res.status(201).success({
      created_user: newUser,
      message: "테스트 유저 생성에 성공했습니다.",
    });
  } catch (error) {
    logger.error(`[handleCreateTestUser] ${JSON.stringify(error, null, 2)}`);
    next(error);
  }
};

const handleUserLocalLogin = async (req, res, next) => {
  /*
  1. 데이터 검증
  2. 전화번호로 사용자 DB에서 조회
  3. 사용자가 존재하지 않으면 404 반환
  4. 사용자가 존재하면 비밀번호 확인 - 틀리면 401 반환
  5. JWT 토큰 발급
  */
};

const handleKakaoLogin = async (req, res, next) => {
  // ...
};

const handleKakaoCallback = async (req, res, next) => {
  // ...
};

const handleUserLogout = async (req, res, next) => {
  // ...
};

const handleReissueAccessToken = async (req, res, next) => {
  // ...
};

module.exports = {
  handleUserRegister,
  handleUserLocalLogin,
  handleKakaoLogin,
  handleKakaoCallback,
  handleUserLogout,
  handleReissueAccessToken,
  handleCreateTestUser,
};
