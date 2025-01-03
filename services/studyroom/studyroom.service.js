const db = require("../../models");
const CustomError = require("../../errors");
// const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");

exports.getAllStudyrooms = async () => {
  try {
    const studyrooms = await db.Studyroom.findAll({
      where: { status: "active" },
      attributes: { exclude: ["updated_at"] },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: db.Area,
          as: "area",
          // attributes: ["area_id", "sido", "gungu"],
        },
        {
          model: db.StudyroomMember,
          as: "studyroom_members",
          where: { status: "active" },
          attributes: ["role", "status", "user_id"],
          include: [{ model: db.User, as: "user", attributes: ["nickname"] }],
          separate: true,
        },
      ],
    });
    // user_id 를 encrypt62 한 값으로 변경
    const encryptedStudyrooms = studyrooms.map((studyroom) => {
      studyroom.studyroom_members = studyroom.studyroom_members.map(
        (member) => {
          member.user_id = encrypt62(member.user_id);
          return member;
        }
      );
      return studyroom;
    });
    return encryptedStudyrooms;
    // TODO : pagination
    // return studyrooms;
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
    const studyroom = await db.Studyroom.findByPk(studyroomId);
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const area = await studyroom.getArea({
      // attributes: ["area_id", "sido", "gungu"],
    });
    const studyroomMembers = await studyroom.getStudyroom_members({
      // where: { status: "active" },
      // attributes: ["role", "status"],
      include: [{ model: db.User, as: "user", attributes: ["nickname"] }],
    });
    // const studyroomMemberUsers = await studyroomMembers.
    // const studyroomTodos = await studyroom.getStudyroom_todos({
    //   //  where: { status: "active" } ,
    // });

    // user_id 를 encrypt62 한 값으로 변경
    const encryptedStudyroomMembers = studyroomMembers.map((member) => {
      member.user_id = encrypt62(member.user_id);
      return member;
    });
    const studyroomTodos = await studyroom.getStudyroom_todos({
      include: [
        {
          model: db.Todo,
          as: "todo",
          include: [{ model: db.TodoParticipant, as: "todo_participants" }],
        },
      ],
    });
    // const todos =
    return {
      studyroom,
      area,
      studyroomMembers: encryptedStudyroomMembers,
      studyroomTodos,
    };

    // const studyroom = await db.Studyroom.findByPk(studyroomId, {
    //   attributes: { exclude: ["updated_at"] },
    //   // attributes: [
    //   //   "studyroom_id",
    //   //   "title",
    //   //   "subtitle",
    //   //   "area_id",
    //   //   "goal",
    //   //   "goal_url",
    //   //   "profile_image",
    //   //   "status",
    //   //   "created_at",
    //   // ],
    //   include: [
    //     {
    //       model: db.Area,
    //       as: "area",
    //       attributes: ["area_id", "sido", "gungu"],
    //     },
    //     {
    //       model: db.StudyroomMember,
    //       as: "studyroom_members",
    //       where: { status: "active" },
    //       attributes: ["role", "status"],
    //       include: [
    //         { model: db.User, as: "user", attributes: ["user_id", "nickname"] },
    //       ],
    //     },
    //     // { model: db.UserStudyroom, as: "user_studyrooms" }, // TODO : 스터디룸멤버 모델(테이블)과 중복되는 부분이 있는데, 굳이 필요한가?
    //     // {
    //     //   model: db.StudyroomChat,
    //     //   as: "studyroom_chats",
    //     //   attributes: ["sender_id", "type", "content", "created_at"],
    //     //   include: [{ model: db.User, as: "sender" }],
    //     // },
    //     {
    //       model: db.StudyroomTodo,
    //       as: "studyroom_todos",
    //       attributes: ["todo_id"],
    //       include: [
    //         {
    //           model: db.Todo,
    //           as: "todo",
    //           attributes: {
    //             exclude: ["updated_at"],
    //           },
    //           include: [
    //             {
    //               model: db.User,
    //               as: "creater",
    //               attributes: ["user_id", "nickname"],
    //             },
    //             {
    //               model: db.TodoParticipant,
    //               as: "todo_participants",
    //               include: [
    //                 {
    //                   model: db.User,
    //                   as: "assigned_user",
    //                   attributes: ["user_id", "nickname"],
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // }); // if not found, return null
    // if (!studyroom) {
    //   throw new CustomError.NotExistsError(
    //     "스터디룸 정보가 존재하지 않습니다."
    //   );
    // }
    // return studyroom;
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

exports.getTodosByStudyroomId = async ({ userId, studyroomId }) => {
  try {
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: studyroomId, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const studyroomMember = await db.StudyroomMember.findOne({
      where: { studyroom_id: studyroomId, user_id: userId, status: "active" },
    });
    if (!studyroomMember) {
      throw new CustomError.NotExistsError(
        "스터디룸 멤버 정보가 존재하지 않습니다."
      );
    }
    const todos = await db.StudyroomTodo.findAll({
      where: { studyroom_id: studyroomId },
      attributes: ["studyroom_todo_id", "todo_id", "created_at", "updated_at"],
      include: [
        {
          model: db.Todo,
          as: "todo",
          attributes: [
            "title",
            "content",
            "location",
            "starts_at",
            "ends_at",
            "status",
            "creater_id",
            "created_at",
            "updated_at",
          ],
          include: [
            {
              model: db.User,
              as: "creater",
              attributes: ["nickname"],
            },
            {
              model: db.TodoParticipant,
              as: "todo_participants",
              attributes: [
                "todo_participant_id",
                "assigned_user_id",
                "status",
                "comment",
                "image_url",
              ],
              include: [
                {
                  model: db.User,
                  as: "assigned_user",
                  attributes: ["nickname"],
                },
              ],
            },
          ],
        },
      ],
    });
    // encrypt62로 creater_id, assigned_user_id 변경
    const encryptedTodos = todos.map((todo) => {
      todo.todo.creater_id = encrypt62(todo.todo.creater_id);
      todo.todo.todo_participants = todo.todo.todo_participants.map(
        (participant) => {
          participant.assigned_user_id = encrypt62(
            participant.assigned_user_id
          );
          return participant;
        }
      );
      return todo;
    });
    return encryptedTodos;
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError(
        "스터디룸 할일 목록 조회 중 에러.",
        error
      );
    }
    throw error;
  }
};

exports.createTodo = async ({ userId, studyroomId, ...todoData }) => {
  try {
    console.log("✨✨ ~ exports.createTodo= ~ todoData:", todoData);
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: studyroomId, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const studyroomMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: studyroomId,
        user_id: userId,
        status: "active",
        [db.Sequelize.Op.or]: [{ role: "owner" }, { role: "admin" }],
      },
    });
    if (!studyroomMember) {
      throw new CustomError.NotAllowedError(
        "스터디룸 할일 생성 권한이 없습니다."
      );
    }
    const todo = await db.Todo.create({
      title: todoData.title,
      content: todoData.content,
      location: todoData.location,
      starts_at: todoData.starts_at,
      ends_at: todoData.ends_at,
      creater_id: userId,
      status: "pending",
    });
    const todoParticipant = await db.TodoParticipant.create({
      todo_id: todo.todo_id,
      assigned_user_id: userId, // TODO : 현재는 본인만 할당 되도록 설정함.
      status: "pending",
      comment: "",
      image_url: "",
    });
    const userTodo = await db.UserTodo.create({
      user_id: userId,
      todo_id: todo.todo_id,
    });
    const studyroomTodo = await db.StudyroomTodo.create({
      studyroom_id: studyroomId,
      todo_id: todo.todo_id,
    });
    // TODO : transaction 처리
    return { message: "할일 생성 성공", todo_id: todo.todo_id };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("할일 생성 중 에러.", error);
    }
    throw error;
  }
};

exports.joinTodo = async ({ userId, studyroomId, todoId }) => {
  try {
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: studyroomId, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const studyroomMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: studyroomId,
        user_id: userId,
        status: "active",
      },
    });
    if (!studyroomMember) {
      throw new CustomError.NotAllowedError(
        "스터디룸 할일 참여 권한이 없습니다."
      );
    }
    const todo = await db.Todo.findByPk(todoId);
    if (!todo) {
      throw new CustomError.NotExistsError("할일 정보가 존재하지 않습니다.");
    }
    const todoParticipant = await db.TodoParticipant.findOne({
      where: { todo_id: todoId, assigned_user_id: userId },
    });
    if (todoParticipant) {
      throw new CustomError.AlreadyExistsError("이미 참여한 할일입니다.");
    }
    const newTodoParticipant = await db.TodoParticipant.create({
      todo_id: todoId,
      assigned_user_id: userId,
      status: "pending",
      comment: "",
      image_url: "",
    });
    const userTodo = await db.UserTodo.create({
      user_id: userId,
      todo_id: todoId,
    });
    return { message: "할일 가입 성공", todo_id: todoId };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("할일 가입 중 에러.", error);
    }
    throw error;
  }
};

exports.submitTodo = async ({
  userId,
  studyroomId,
  todoId,
  comment,
  image_url,
}) => {
  try {
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: studyroomId, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const studyroomMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: studyroomId,
        user_id: userId,
        status: "active",
      },
    });
    if (!studyroomMember) {
      throw new CustomError.NotAllowedError(
        "스터디룸 할일 제출 권한이 없습니다."
      );
    }
    const todo = await db.Todo.findByPk(todoId);
    if (!todo) {
      throw new CustomError.NotExistsError("할일 정보가 존재하지 않습니다.");
    }
    const todoParticipant = await db.TodoParticipant.findOne({
      where: { todo_id: todoId, assigned_user_id: userId },
    });
    if (!todoParticipant) {
      throw new CustomError.NotExistsError(
        "할일 참여 정보가 존재하지 않습니다."
      );
    }
    await db.TodoParticipant.update(
      {
        status: "done",
        comment: comment,
        image_url: image_url,
      },
      { where: { todo_id: todoId, assigned_user_id: userId } }
    );
    return { message: "할일 제출 성공", todo_id: todoId };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("할일 제출 중 에러.", error);
    }
    throw error;
  }
};

exports.getMembersByStudyroomId = async ({ userId, studyroomId }) => {
  try {
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: studyroomId, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }
    const studyroomMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: studyroomId,
        user_id: userId,
        status: "active",
      },
    });
    if (!studyroomMember) {
      throw new CustomError.NotAllowedError(
        "스터디룸 멤버 조회 권한이 없습니다."
      );
    }

    const studyroomMembers = await db.StudyroomMember.findAll({
      where: { studyroom_id: studyroomId, status: "active" },
      include: [{ model: db.User, as: "user", attributes: ["nickname"] }],
    });
    return { message: "스터디룸 멤버 조회 성공", members: studyroomMembers };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError(
        "스터디룸 멤버 목록 조회 중 에러.",
        error
      );
    }
    throw error;
  }
};

exports.inviteUser = async ({ inviterId, studyroomId, inviteePhone }) => {
  try {
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: studyroomId, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }

    const studyroomMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: studyroomId,
        user_id: inviterId,
        role: "owner",
      },
    });
    if (!studyroomMember) {
      throw new CustomError.NotAllowedError(
        "스터디룸 멤버 초대 권한이 없습니다."
      );
    }

    // TODO : 휴대폰 번호로 사용자 조회
    const invitee = await db.User.findOne({
      where: { phone_number: inviteePhone },
    });
    if (!invitee) {
      throw new CustomError.NotExistsError(
        "초대할 사용자 정보가 존재하지 않습니다."
      );
    }

    const exMember = await db.StudyroomMember.findOne({
      where: {
        studyroom_id: studyroomId,
        user_id: invitee.user_id,
      },
    });
    if (exMember) {
      throw new CustomError.AlreadyExistsError("이미 가입한 사용자입니다.");
    }

    const invite = await db.StudyroomInvite.create({
      studyroom_id: studyroomId,
      inviter_id: inviterId,
      invitee_id: invitee.user_id,
      status: "pending",
    });
    return { message: "사용자 초대 요청 완료" };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("사용자 초대 중 에러.", error);
    }
    throw error;
  }
};

exports.acceptInvitation = async ({ userId, inviteId }) => {
  try {
    const invite = await db.StudyroomInvite.findOne({
      where: {
        studyroom_invite_id: inviteId,
        invitee_id: userId,
        status: "pending",
      },
    });
    if (!invite) {
      throw new CustomError.NotExistsError(
        "초대 정보가 존재하지 않거나 이미 처리된 초대입니다."
      );
    }
    const studyroom = await db.Studyroom.findOne({
      where: { studyroom_id: invite.studyroom_id, status: "active" },
    });
    if (!studyroom) {
      throw new CustomError.NotExistsError(
        "스터디룸 정보가 존재하지 않습니다."
      );
    }

    const studyroomMember = await db.StudyroomMember.create({
      studyroom_id: invite.studyroom_id,
      user_id: userId,
      role: "member",
      status: "active",
    }); // user_studyroom 은 중복되므로 생략
    await invite.update({ status: "accepted" });
    return { message: "초대 수락 성공" };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("초대 수락 중 에러.", error);
    }
    throw error;
  }
};

exports.getReceivedInvites = async ({ userId }) => {
  try {
    const invites = await db.StudyroomInvite.findAll({
      where: {
        invitee_id: userId,
        status: "pending",
      },
      attributes: [
        "studyroom_invite_id",
        "studyroom_id",
        "inviter_id",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: db.Studyroom,
          as: "studyroom",
          attributes: ["title"],
        },
        {
          model: db.User,
          as: "inviter",
          attributes: ["nickname"],
        },
      ],
    });
    // user_id 를 encrypt62 한 값으로 변경
    const encryptedInvites = invites.map((invite) => {
      invite.inviter_id = encrypt62(invite.inviter_id);
      return invite;
    });

    return { message: "받은 초대 목록 조회 성공", invites: encryptedInvites };
  } catch (error) {
    // logger.error(error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError(
        "받은 초대 목록 조회 중 에러.",
        error
      );
    }
    throw error;
  }
};
