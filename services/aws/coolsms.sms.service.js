const axios = require("axios");
const crypto = require("crypto");
const coolsms = require("coolsms-node-sdk").default;

const config = require("../../config.json");
const logger = require("../../logger");
const { logError } = require("../../utils/handlers/error.logger");
const { API_KEY, API_SECRET, SENDER } = config.COOLSMS;

const messageService = new coolsms(API_KEY, API_SECRET);

const getAuthorizationHeader = async (apiKey, apiSecret) => {
  const date = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 15);
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(date + salt)
    .digest("hex");

  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
};

const axiosSendSMS = async (to, from, text) => {
  const apiKey = API_KEY;
  const apiSecret = API_SECRET;
  const url = "https://api.coolsms.co.kr/messages/v4/send";

  const headers = {
    "Content-Type": "application/json",
    Authorization: getAuthorizationHeader(apiKey, apiSecret),
  };

  const data = {
    message: { to, from, text },
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("메시지가 성공적으로 전송되었습니다:", response.data);
    return response.data;
  } catch (error) {
    console.error("메시지 전송 중 오류가 발생했습니다:", error.response.data);
    throw error;
  }
};

const sdkSendSMS = async (to, text) => {
  try {
    const result = await messageService.sendOne({
      to,
      from: SENDER,
      text,
    });

    logger.debug(`메시지 전송 결과: ${JSON.stringify(result, null, 2)}`);
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

const sdkGetBalance = async () => {
  try {
    const result = await messageService.getBalance();
    logger.debug(`잔액 조회 결과: ${JSON.stringify(result, null, 2)}`);
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

const sdkGetMessage = async ({
  limit,
  message_id,
  message_ids,
  group_id,
  from,
  to,
  type,
  duration,
}) => {
  const params = {};
  if (limit) params.limit = limit;
  if (message_id) params.message_id = message_id;
  if (message_ids) params.message_ids = message_ids;
  if (group_id) params.group_id = group_id;
  if (from) params.from = from;
  if (to) params.to = to;
  if (type) params.type = type;
  if (duration) params.duration = duration;

  return await messageService.getMessages(params);
};

const sdkGetStatistics = async ({ start_date, end_date }) => {
  const params = {
    start_date: start_date || new Date().toISOString().split("T")[0],
    end_date: end_date || new Date().toISOString().split("T")[0],
  };

  return await messageService.getStatistics(params);
};

module.exports = {
  axiosSendSMS,
  sdkSendSMS,
  sdkGetBalance,
  sdkGetMessage,
  sdkGetStatistics,
};

// const { CoolsmsMessageService } = require("coolsms-node-sdk");
// const messageService = new CoolsmsMessageService(
//   "API 키 입력",
//   "API 시크릿 키 입력"
// );

// messageService
//   .getMessages({
//     // 불러올 메시지 갯수 제한
//     // limit: 5, // 5를 입력하면 5건이 조회됩니다, 미 입력시 20개로 지정
//     // 메시지 ID로 검색
//     // messageId: '메시지 ID 입력', // 메시지 ID는 대개 M4V로 시작합니다
//     // 여러 메시지 ID로 검색
//     /*messageIds: [
//     '메시지 ID 입력' // 메시지 ID는 대개 M4V로 시작합니다
//   ],*/
//     // 그룹 ID로 검색
//     // groupId: '그룹 ID 입력', // 그룹 ID는 대개 G4V로 시작합니다
//     // 발신번호로 검색
//     // from: '01012345678',
//     // 수신번호로 검색
//     // to: '01012345678',
//     /**
//      * 메시지 타입으로 검색
//      * SMS: 단문 문자, LMS: 장문 문자, MMS: 사진 문자, ATA: 알림톡, CTA: 친구톡, CTI: 이미지(1장) 친구톡
//      */
//     // type: "SMS",
//     // 날짜로 검색하는 경우
//     /*duration: {
//     dateType: 'CREATED', 메시지 생성 일 기준, UPDATED로 변경하면 메시지 상태 갱신일자 기준으로 조회 함
//     startDate: '2022-05-01 00:00:00', // Date 객체로도 요청 가능
//     endDate: '2022-05-31 23:59:59' // Date 객체로도 요청 가능
//   }*/
//   })
//   .then((res) => console.log(res));

// /**
//  * 페이징 예제
//  * */
// messageService.getMessages().then((res) => {
//   // for등의 반복문을 이용하여 페이징 된 데이터를 지속적으로 조회할 수 있습니다!
//   messageService
//     .getMessages({
//       // startKey 부분에 nextKey를 입력할 경우 초기 20건 다음의 데이터를 표시하게 됩니다.
//       startKey: res.nextKey,
//     })
//     .then((res2) => {
//       console.log(res2);
//     });
// });

// const { CoolsmsMessageService } = require("coolsms-node-sdk");
// const messageService = new CoolsmsMessageService(
//   "API 키 입력",
//   "API 시크릿 키 입력"
// );

// messageService
//   .getStatistics({
//     // 날짜로 검색하는 경우
//     /*duration: {
//     startDate: '2022-03-01 00:00:00', // Date 객체로도 요청 가능
//     endDate: '2022-03-31 23:59:59' // Date 객체로도 요청 가능
//   }*/
//   })
//   .then((res) => console.log(res));
