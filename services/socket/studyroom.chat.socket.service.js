const { NotAllowedError } = require("../../errors");
const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");
const {
  StudyroomChat,
  User,
  StudyroomMember,
  Sequelize,
} = require("../../models");

const getChatByCursor = async ({ studyroom_id, cursor = null, user_id }) => {
  // LIMIT
  const limit = 5;
  // cursor 유무에 따라 where clause 생성
  const whereClause = {
    studyroom_id: studyroom_id,
  };
  if (cursor) {
    // 커서를 기반으로 studyroom_chat_id가 cursor보다 작은(오래된) 채팅을 조회
    whereClause.studyroom_chat_id = { [Sequelize.Op.lt]: cursor };
  }

  const chats = await StudyroomChat.findAll({
    include: [
      {
        model: User,
        as: "sender", // StudyroomChat에 정의된 별칭
        attributes: ["name", "nickname", "profile_image"],
        required: false,
      },
    ],
    attributes: [
      "studyroom_chat_id",
      "studyroom_id",
      "sender_id",
      "type",
      "content",
      "created_at",
    ],
    where: whereClause,
    limit: limit + 1, // 다음 페이지 존재 여부 확인을 위해 하나 더 조회
    order: [["studyroom_chat_id", "DESC"]], // 오래된게 앞에 표시되도록 ASC로 변경
  });

  let hasNextPage = false;

  logger.debug(`[getChatByCursor] chats: ${chats.length}`);
  if (chats.length > limit) {
    hasNextPage = true;
    chats.pop(); // limit + 1로 조회한 초과 레코드는 제거
  }
  chats.reverse(); // 오래된 채팅이 앞에 표시되도록 순서 변경

  const nextCursor = hasNextPage ? chats[0].studyroom_chat_id : null;

  let ret = [];
  for (const chat of chats) {
    ret.push({
      is_my_chat: chat.sender_id === user_id,
      studyroom_chat_id: chat.studyroom_chat_id,
      studyroom_id: chat.studyroom_id,
      sender_id: encrypt62(chat.sender_id),
      sender_name: chat.sender ? chat.sender.name : null,
      sender_nickname: chat.sender ? chat.sender.nickname : null,
      sender_profile_image: chat.sender ? chat.sender.profile_image : null,
      type: chat.type,
      content: chat.content,
      created_at: chat.created_at,
    });
  }

  logger.debug(
    `[getChatByCursor] nextCursor: ${nextCursor} hasNextPage: ${hasNextPage}`
  );

  return {
    chats: ret,
    nextCursor,
    hasNextPage,
  };
};

const isUserInStudyroom = async ({ studyroom_id, user_id }) => {
  const result = await StudyroomMember.findOne({
    attributes: ["studyroom_id"],
    where: {
      studyroom_id: studyroom_id,
      user_id: user_id,
      status: "active",
    },
  });
  if (!result) {
    logger.error(
      `[isUserInStudyroom] ${user_id} 사용자가 ${studyroom_id} 스터디룸에 접근을 시도했습니다.`
    );
    throw new NotAllowedError("해당 스터디룸에 속한 사용자가 아닙니다.");
  }
  logger.debug(
    `[isUserInStudyroom] ${user_id} 사용자가 ${studyroom_id} 스터디룸에 접근했습니다.`
  );
  return result;
};

const saveChat = async (studyroomId, senderId, type, content) => {
  const result = await StudyroomChat.create({
    studyroom_id: studyroomId,
    sender_id: senderId,
    type,
    content,
  });
  if (!result) {
    throw new InvalidInputError("채팅 저장에 실패했습니다.");
  }

  return result;
};

const getNameAndNicknameById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["name", "nickname"],
  });
  logger.info(
    `[getNameAndNicknameById] ${userId} 사용자 정보 조회: ${user.name}`
  );

  if (!user) {
    throw new NotAllowedError("사용자 정보를 찾을 수 없습니다.");
  }
  return {
    name: user.name,
    nickname: user.nickname,
  };
};

module.exports = {
  isUserInStudyroom,
  saveChat,
  getChatByCursor,
  getNameAndNicknameById,
};
