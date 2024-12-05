const { DatabaseError } = require("sequelize");
const { createTestUserService } = require("../services/auth.service");
const logger = require("../logger");

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
    const {
      user_register_type,
      name,
      nickname,
      birthdate,
      phone_number,
      phone_number_verification_id,
      email,
      email_verification_id,
      profile_image,
      password,
    } = req.body;
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

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
    logger.error(error);
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
