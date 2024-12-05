class SampleError extends Error {
  errorCode = "SAMPLE_ERROR"; // 한두단어로 에러표시
  statusCode = 500; // 해당 에러 발생 시 전달할 응답코드

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

/*
사용할 땐 아래와 같이 사용하면 됩니다.
throw new SampleError("그냥 냈음", { data: "sample data" });
*/

module.exports = {
  SampleError,
};
