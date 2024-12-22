class SampleError extends Error {
  errorCode = "SAMPLE_ERROR"; // 한두단어로 에러표시
  statusCode = 500; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class CustomError extends Error {
  constructor(reason, errorCode, statusCode, data = null) {
    super(reason); // error.message = reason
    this.reason = reason; // error.reason = reason
    this.name = this.constructor.name;
    this.errorCode = errorCode; // 한두단어로 에러표시. "SAMPLE_ERROR"
    this.statusCode = statusCode; // 해당 에러 발생 시 전달할 응답코드. 500
    this.data = data; // 추가 에러 데이터.
    Error.captureStackTrace(this, this.constructor);
  }
}

class RelatedServiceUnavailableError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "RELATED_SERVICE_UNAVAILABLE", 503, data);
  }
}

class DatabaseError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "DB_ERROR", 500, data);
  }
}

class InvalidInputError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "INVALID_INPUT", 400, data);
  }
}

class AlreadyExistsError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "ALREADY_EXISTS", 409, data);
  }
}

class NotExistsError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "NOT_EXISTS", 404, data);
  }
}

class NotAllowedError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "NOT_ALLOWED", 403, data);
  }
}
class UnauthorizedError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "UNAUTHORIZED", 401, data);
  }
}

class KakaoUserNotRegisteredError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "USER_NOT_REGISTERED", 418, data);
  }
}

class InvalidTokenError extends CustomError {
  constructor(reason, data = null) {
    const statusCode = data?.statusCode || 400;
    super(reason, "INVALID_TOKEN", statusCode, data);
  }
}

class EmailSendingError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "SENDING_EMAIL_ERROR", 500, data);
  }
}

class UnknownError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "UNKNOWN_ERROR", 500, data);
  }
}

/*
사용할 땐 아래와 같이 사용하면 됩니다.
throw new SampleError("그냥 냈음", { data1: "sample data 1", data2: "sample data 2" });
*/

module.exports = {
  SampleError,
  DatabaseError,
  InvalidInputError,
  AlreadyExistsError,
  NotExistsError,
  NotAllowedError,
  UnauthorizedError,
  KakaoUserNotRegisteredError,
  RelatedServiceUnavailableError,
  InvalidTokenError,
  EmailSendingError,
  UnknownError,
};
