class SampleError extends Error {
  errorCode = "SAMPLE_ERROR"; // 한두단어로 에러표시
  statusCode = 500; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
class AWSError extends Error {
  errorCode = "AWS_ERROR"; // 한두단어로 에러표시
  statusCode = 503; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class RelatedServiceUnavailableError extends Error {
  errorCode = "RELATED_SERVICE_UNAVAILABLE"; // 한두단어로 에러표시
  statusCode = 503; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class DatabaseError extends Error {
  errorCode = "DB_ERROR"; // 한두단어로 에러표시
  statusCode = 500; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class InvalidInputError extends Error {
  errorCode = "INVALID_INPUT"; // 한두단어로 에러표시
  statusCode = 400; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
class AlreadyExistsError extends Error {
  errorCode = "ALREADY_EXISTS"; // 한두단어로 에러표시
  statusCode = 409; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
class NotExistsError extends Error {
  errorCode = "NOT_EXISTS"; // 한두단어로 에러표시
  statusCode = 404; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
class NotAllowedError extends Error {
  errorCode = "NOT_ALLOWED"; // 한두단어로 에러표시
  statusCode = 403; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
class UnauthorizedError extends Error {
  errorCode = "UNAUTHORIZED"; // 한두단어로 에러표시
  statusCode = 401; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class KakaoUserNotRegisteredError extends Error {
  errorCode = "USER_NOT_REGISTERED"; // 한두단어로 에러표시
  statusCode = 418; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidTokenError";
    this.status = 400;
  }
}

/*
사용할 땐 아래와 같이 사용하면 됩니다.
throw new SampleError("그냥 냈음", { data: "sample data" });
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
  AWSError,
};
