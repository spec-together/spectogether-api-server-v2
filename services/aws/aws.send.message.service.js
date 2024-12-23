const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const logger = require("../../logger");
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } =
  require("../../config.json").AWS.ST_MESSAGE_SENDER;

// SNS 클라이언트 생성
const snsClient = new SNSClient({
  region: "ap-northeast-1", // 사용하는 리전으로 설정
  credentials: {
    accessKeyId: ACCESS_KEY_ID, // 발급받은 Access Key ID
    secretAccessKey: SECRET_ACCESS_KEY, // 발급받은 Secret Access Key
  },
});

// SMS 전송 함수
const sendSMS = async (phoneNumber, message) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    const command = new PublishCommand(params);
    const data = await snsClient.send(command);
    logger.info(`[AWS.send.message] 메시지 전송 성공: ${data.MessageId}`);
    return data;
  } catch (error) {
    logger.error(`[AWS.send.message] 메시지 전송 실패: ${error}`);
    throw error;
  }
};

module.exports = {
  sendSMS,
};
