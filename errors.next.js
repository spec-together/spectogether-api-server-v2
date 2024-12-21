// 참고용 코드. 추후 리팩토링 고려 용도
class CustomError extends Error {
  constructor(message, errorCode, statusCode, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode; // 한두단어로 에러표시
    this.statusCode = statusCode; // 해당 에러 발생 시 전달할 응답코드
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

class SampleError extends CustomError {
  constructor(message, data = null) {
    super(message, "SAMPLE_ERROR", 500, data);
  }
}

class RelatedServiceUnavailableError extends CustomError {
  constructor(message, data = null) {
    super(message, "RELATED_SERVICE_UNAVAILABLE", 503, data);
  }
}

class DatabaseError extends CustomError {
  constructor(message, data = null) {
    super(message, "DB_ERROR", 500, data);
  }
}

class InvalidInputError extends CustomError {
  constructor(message, data = null) {
    super(message, "INVALID_INPUT", 400, data);
  }
}

class AlreadyExistsError extends CustomError {
  constructor(message, data = null) {
    super(message, "ALREADY_EXISTS", 409, data);
  }
}

class NotExistsError extends CustomError {
  constructor(message, data = null) {
    super(message, "NOT_EXISTS", 404, data);
  }
}

class NotAllowedError extends CustomError {
  constructor(message, data = null) {
    super(message, "NOT_ALLOWED", 403, data);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message, data = null) {
    super(message, "UNAUTHORIZED", 401, data);
  }
}

class KakaoUserNotRegisteredError extends CustomError {
  constructor(message, data = null) {
    super(message, "USER_NOT_REGISTERED", 418, data);
  }
}

class InvalidTokenError extends CustomError {
  constructor(message, data = null) {
    super(message, "INVALID_TOKEN", 400, data);
  }
}

/*
  사용할 땐 아래와 같이 사용하면 됩니다.
  throw new SampleError("그냥 냈음", { data: "sample data" });
*/

module.exports = {
  SampleError,
  RelatedServiceUnavailableError,
  DatabaseError,
  InvalidInputError,
  AlreadyExistsError,
  NotExistsError,
  NotAllowedError,
  UnauthorizedError,
  KakaoUserNotRegisteredError,
  InvalidTokenError,
};
