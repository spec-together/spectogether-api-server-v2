const handleUserRegister = async (req, res, next) => {
  /*
  1. 데이터 검증
  2. 이미 존재하는 사용자인지 확인 ( key = email )
  3. email verification id에 등록된 email과 일치하는지 확인
  4. spec_level, manner_level, role, is_active 는 default로 생성
  5. calendar 생성, user_calendar 연결
  6. todo는 나중에 테이블에 쿼리 떄릴거임
  */
};

const handleUserLocalLogin = async (req, res, next) => {
  // ...
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
};
