const db = require("../../models");
const CustomError = require("../../errors");
// const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");

exports.getAllStudyrooms = async () => {
  try {
    const studyrooms = await db.Studyroom.findAll({
      where: { status: "active" },
      attributes: { exclude: ["updated_at"] },
      include: [
        {
          model: db.Area,
          as: "area",
          attributes: ["area_id", "sido", "gungu"],
        },
        {
          model: db.StudyroomMember,
          as: "studyroom_members",
          where: { status: "active" },
          attributes: ["role", "status"],
          include: [
            { model: db.User, as: "user", attributes: ["user_id", "nickname"] },
          ],
        },
        // { model: db.UserStudyroom, as: "user_studyrooms" }, // TODO : 스터디룸멤버 모델(테이블)과 중복되는 부분이 있는데, 굳이 필요한가?
        // {
        //   model: db.StudyroomChat,
        //   as: "studyroom_chats",
        //   attributes: ["sender_id", "type", "content", "created_at"],
        //   include: [{ model: db.User, as: "sender" }],
        // },
        {
          model: db.StudyroomTodo,
          as: "studyroom_todos",
          attributes: ["todo_id"],
          include: [
            {
              model: db.Todo,
              as: "todo",
              attributes: {
                exclude: ["updated_at"],
              },
              include: [
                {
                  model: db.User,
                  as: "creater",
                  attributes: ["user_id", "nickname"],
                },
                {
                  model: db.TodoParticipant,
                  as: "todo_participants",
                  include: [
                    {
                      model: db.User,
                      as: "assigned_user",
                      attributes: ["user_id", "nickname"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    // TODO : pagination
    return studyrooms;
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("스터디룸 목록 조회 중 에러.", error);
    }
    throw error;
  }
};

exports.getStudyroomByStudyroomId = async (studyroomId) => {
  try {
    const studyroom = await db.Studyroom.findByPk(studyroomId, {
      attributes: { exclude: ["updated_at"] },
      include: [
        {
          model: db.Area,
          as: "area",
          attributes: ["area_id", "sido", "gungu"],
        },
        {
          model: db.StudyroomMember,
          as: "studyroom_members",
          where: { status: "active" },
          attributes: ["role", "status"],
          include: [
            { model: db.User, as: "user", attributes: ["user_id", "nickname"] },
          ],
        },
        // { model: db.UserStudyroom, as: "user_studyrooms" }, // TODO : 스터디룸멤버 모델(테이블)과 중복되는 부분이 있는데, 굳이 필요한가?
        // {
        //   model: db.StudyroomChat,
        //   as: "studyroom_chats",
        //   attributes: ["sender_id", "type", "content", "created_at"],
        //   include: [{ model: db.User, as: "sender" }],
        // },
        {
          model: db.StudyroomTodo,
          as: "studyroom_todos",
          attributes: ["todo_id"],
          include: [
            {
              model: db.Todo,
              as: "todo",
              attributes: {
                exclude: ["updated_at"],
              },
              include: [
                {
                  model: db.User,
                  as: "creater",
                  attributes: ["user_id", "nickname"],
                },
                {
                  model: db.TodoParticipant,
                  as: "todo_participants",
                  include: [
                    {
                      model: db.User,
                      as: "assigned_user",
                      attributes: ["user_id", "nickname"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }); // if not found, return null
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    return studyroom;
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("스터디룸 정보 조회 중 에러.", error);
    }
    throw error;
  }
};

exports.createStudyroom = async (studyroomData) => {
  try {
    const newStudyroom = await db.Studyroom.create({
      title: studyroomData.title,
      subtitle: studyroomData.subtitle,
      area_id: studyroomData.area_id,
      goal: studyroomData.goal,
      goal_url: studyroomData.goal_url,
      profile_image: studyroomData.profile_image,
      status: "active", // 모델에 기본값 설정하기
    });
    const studyroomMember = await db.StudyroomMember.create({
      studyroom_id: newStudyroom.studyroom_id,
      user_id: studyroomData.user_id,
      role: "owner",
      status: "active",
    });
    const userStudyroom = await db.UserStudyroom.create({
      studyroom_id: newStudyroom.studyroom_id,
      user_id: studyroomMember.user_id,
    });
    return {
      studyroom_id: newStudyroom.studyroom_id,
      message: "스터디룸 생성 성공",
    };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("스터디룸 생성 중 에러.", error);
    }
    throw error;
  }
};

exports.joinStudyroom = async (joinData) => {
  try {
    // const studyroom = await db.Studyroom.findByPk(joinData.studyroom_id);
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: joinData.studyroom_id, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const exMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: joinData.studyroom_id,
        user_id: joinData.user_id,
      },
    });
    if (exMember) {
      throw new CustomError.AlreadyExistsError("이미 가입한 스터디룸입니다.");
    }

    const studyroomMember = await db.StudyroomMember.create({
      studyroom_id: joinData.studyroom_id,
      user_id: joinData.user_id,
      role: "member",
      status: "active",
    });
    const userStudyroom = await db.UserStudyroom.create({
      studyroom_id: joinData.studyroom_id,
      user_id: joinData.user_id,
    });
    return {
      studyroom_id: studyroom.studyroom_id,
      message: "스터디룸 가입 성공",
    };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("스터디룸 가입 중 에러.", error);
    }
    throw error;
  }
};

// exports.updateStudyroom = async (studyroomId, studyroom) => {};

exports.deleteStudyroom = async ({ studyroomId, userId }) => {
  try {
    const studyroom = await db.Studyroom.findByPk(studyroomId);
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const studyroomMember = await db.StudyroomMember.findOne({
      where: { studyroom_id: studyroomId, user_id: userId },
    });
    if (!studyroomMember) {
      throw new CustomError.NotExistsError(
        "스터디룸 멤버 정보가 존재하지 않습니다."
      );
    }
    if (studyroomMember.role !== "owner") {
      throw new CustomError.UnauthorizedError("스터디룸 삭제 권한이 없습니다.");
    }
    await db.Studyroom.update(
      { status: "deleted" },
      { where: { studyroom_id: studyroomId } }
    );
    // TODO : 스터디룸 멤버들 모두 비활성화 처리
    return { message: "스터디룸 삭제 성공" };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("스터디룸 삭제 중 에러.", error);
    }
    throw error;
  }
};
