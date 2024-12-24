const { NotExistsError, DatabaseError } = require("../../errors");
const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");
const {
  UserTerm,
  UserStudyroom,
  Studyroom,
  Todo,
  TodoMember,
  UserSpec,
  Spec,
  UserArea,
  Area,
  User,
} = require("../models");

exports.getUserAgreedTerms = async (userId) => {
  const userAgreedTerms = await UserTerm.findAll({
    where: {
      user_id: userId,
    },
  });
  logger.debug(
    `[getUserAgreedTermsService] 해당 사용자의 동의한 약관을 가져옵니다: ${JSON.stringify(
      userAgreedTerms,
      null,
      2
    )}`
  );
  if (!userAgreedTerms) {
    throw new NotExistsError("해당 사용자의 동의한 약관이 없습니다.");
  }

  let ret = [];

  for (const term of userAgreedTerms) {
    // TIP :for ~ in 과 for ~ of 의 차이는?
    ret.push({
      term_id: term.term_id,
      is_agreed: term.is_agreed,
      last_agreed_at: term.updated_at,
    });
  }

  return ret;
};

exports.getUserStudyroom = async (userId) => {
  const studyrooms = await UserStudyroom.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Studyroom,
        attributes: [
          "studyroom_id",
          "title",
          "subtitle",
          "area_id",
          "profile_image",
          "target_type",
          "target_id",
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
      studyroom_id: encrypt62(studyroom.Studyroom.studyroom_id),
      title: studyroom.Studyroom.title,
      subtitle: studyroom.Studyroom.subtitle,
      area_id: studyroom.Studyroom.area_id,
      profile_image: studyroom.Studyroom.profile_image,
      target_type: studyroom.Studyroom.target_type,
      target_id: studyroom.Studyroom.target_id,
      status: studyroom.Studyroom.status,
      created_at: studyroom.Studyroom.created_at,
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

exports.getUserTodo = async (userId) => {
  const todos = await Todo.findAll({
    attributes: [
      "todo_id",
      "title",
      "subtitle",
      "content",
      "creater_id",
      "deadline",
      "status",
      "created_at",
    ],
    include: [
      {
        model: TodoMember,
        where: { assigned_user_id: userId },
        attributes: ["status"], // TodoMember의 속성을 포함하지 않으려면 빈 배열
      },
    ],
    // 필요한 경우 정렬, 페이징 등을 추가할 수 있습니다.
    // order: [['deadline', 'ASC']],
    // limit: 10,
    // offset: 0,
  });
  if (!todos) {
    throw new NotExistsError("해당 사용자의 할 일이 없습니다.");
  }

  let ret = [];

  for (const todo of todos) {
    ret.push({
      todo_id: todo.todo_id,
      title: todo.title,
      subtitle: todo.subtitle,
      content: todo.content,
      creater_id: encrypt62(todo.creater_id),
      deadline: todo.deadline,
      status: todo.status,
      created_at: todo.created_at,
      assigned_user_id: encrypt62(userId),
      assigned_status: todo.TodoMembers[0]?.status,
    });
  }

  return ret;
};

exports.getTodoInfo = async (todoId) => {
  const todo = await Todo.findByPk(todoId, {
    attributes: [
      "todo_id",
      "title",
      "subtitle",
      "content",
      "creater_id",
      "deadline",
      "status",
      "created_at",
    ],
    // include: [
    //   {
    //     model: TodoMember,
    //     attributes: ["status"],
    //   },
    // ],
  });
  if (!todo) {
    throw new NotExistsError("해당 할 일이 없습니다.");
  }

  return todo;
};

exports.getTodoAssignedUserNumber = async (todoId) => {
  const todo = await TodoMember.findAll({
    where: { todo_id: todoId },
    attributes: ["assigned_user_id", "status"],
  });
  if (!todo) {
    throw new NotExistsError("해당 todo에 배정된 사용자가 존재하지 않습니다.");
  }
  logger.debug(
    `[getTodoAssignedUserNumberService] 해당 할 일에 배정된 사용자 수: ${todo.length}`
  );

  return todo;
};

exports.getUserSpecsByUserId = async (userId) => {
  const userSpecs = await UserSpec.findAll({
    where: { user_id: userId },
    attributes: ["created_at"],
    include: [
      {
        model: Spec,
        attributes: ["spec_id", "title"],
        required: false, // LEFT OUTER JOIN 수행
      },
    ],
  });
  if (!userSpecs) {
    throw new NotExistsError("해당 사용자의 스펙이 없습니다.");
  }
  // Spec 데이터만 추출
  const specs = userSpecs
    .filter((us) => us.Spec !== null)
    .map((us) => ({
      ...us.Spec.dataValues,
      created_at: us.created_at,
      rank: Math.floor(Math.random() * 4) + 1,
    }));
  logger.debug(
    `[getUserSpecsByUserIdService] 파싱된 스펙: ${JSON.stringify(
      specs,
      null,
      2
    )}`
  );
  // TODO : 이거 좀 더 깔끔하게 수정..
  return specs;
};

exports.getUserNeighborhoodsByUserId = async (userId) => {
  const userNeighborhoods = await UserArea.findAll({
    where: {
      user_id: userId,
    },
    attributes: [],
    include: [
      {
        model: Area,
        attributes: ["area_id", "name", "location", "legal_areacode"],
        required: false,
      },
    ],
  });
  logger.debug(
    `[getUserNeighborhoodsByUserIdService] 해당 사용자의 동네를 가져옵니다: ${JSON.stringify(
      userNeighborhoods,
      null,
      2
    )}`
  );
  if (!userNeighborhoods) {
    throw new NotExistsError("해당 사용자의 동네가 없습니다.");
  }
  // Spec 데이터만 추출
  const neighborhoods = userNeighborhoods
    .map((un) => un.Area)
    .filter((area) => area !== null);

  return neighborhoods;
};

exports.getUserMyProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: [
      "user_id",
      "name",
      "nickname",
      "birthdate",
      "phone_number",
      "email",
      "profile_image",
      "spec_level",
      "manner_score",
      "created_at",
    ],
  });
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  return user;
};

exports.getOtherUserProfile = async (otherUserId) => {
  const user = await User.findByPk(otherUserId, {
    attributes: [
      "user_id",
      "nickname",
      "profile_image",
      "spec_level",
      "manner_score",
      "created_at",
    ],
  });
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  return user;
};

exports.editUserInfo = async (userInfo) => {
  const { userId, type, content } = userInfo;
  logger.debug(
    `[editUserInfoService] userId: ${userId}, type: ${type}, content: ${content}`
  );
  let updatedUser;
  if (type === "profile_image") {
    updatedUser = await User.update(
      { profile_image: content },
      { where: { user_id: userId } }
    );
  } else if (type === "nickname") {
    updatedUser = await User.update(
      { nickname: content },
      { where: { user_id: userId } }
    );
  }
  
  if (updatedUser === 0) {
    throw new DatabaseError("기존값과 동일해 정보가 수정되지 않았습니다.");
  }

  return { updatedUser };
};

exports.checkIfUserExistsByUserId = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ["user_id"] });
  logger.debug(
    `[checkIfUserExistsByUserIdService] user: ${JSON.stringify(user, null, 2)}`
  );
  if (!user) {
    throw new NotExistsError("해당 사용자가 존재하지 않습니다.");
  }

  return user;
};