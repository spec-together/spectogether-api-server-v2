const { NotExistsError } = require("../../errors");
const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");
const db = require("../../models");

exports.getUserStudyroom = async (userId) => {
  const studyrooms = await db.UserStudyroom.findAll({
    where: { user_id: userId },
    include: [
      {
        model: db.Studyroom,
        as: "studyroom",
        attributes: [
          "studyroom_id",
          "title",
          "subtitle",
          "area_id",
          "profile_image",
          "goal",
          "status",
          "created_at",
        ],
        required: false,
      },
    ],
  });
  if (!studyrooms) {
    throw new NotExistsError("해당 사용자의 스터디룸이 없습니다.");
  }

  let ret = [];
  for (const studyroom of studyrooms) {
    ret.push({
      studyroom_id: encrypt62(studyroom.studyroom.studyroom_id),
      title: studyroom.studyroom.title,
      subtitle: studyroom.studyroom.subtitle,
      area: studyroom.studyroom.area_id,
      profile_image: studyroom.studyroom.profile_image,
      status: studyroom.studyroom.status,
      created_at: studyroom.studyroom.created_at,
    });
  }
  logger.debug(
    `[getUserStudyroomService] 해당 사용자의 스터디룸: ${JSON.stringify(
      ret,
      null,
      2
    )}`
  );
  return ret;
};
