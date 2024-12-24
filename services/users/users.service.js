const { profile } = require("winston");
const { NotExistsError, DatabaseError } = require("../../errors");
const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");
const db = require("../../models");

exports.getUserAgreedTerms = async (userId) => {
  const currentTerms = await db.Term.findAll({
    where: { status: true },
    attributes: [
      "term_id",
      "name",
      "description",
      "is_required",
      "term_version",
    ],
  });
  if (!currentTerms.length) {
    throw new NotExistsError("현행 약관이 존재하지 않습니다.");
  }
  const userAgreedTerms = await db.UserTerm.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["term_id", "is_agreed"],
  });
  const combinedTerms = currentTerms.map((term) => {
    const userAgreed = userAgreedTerms.find(
      (ut) => ut.term_id === term.term_id
    );
    return {
      id: term.term_id,
      name: term.name,
      description: term.description,
      is_required: term.is_required,
      version: term.term_version,
      user_agreed: userAgreed ? userAgreed.is_agreed : false,
    };
  });

  logger.debug(
    `[getUserAgreedTermsService] 사용자 ID ${userId}의 약관 동의 정보: ${JSON.stringify(
      combinedTerms,
      null,
      2
    )}`
  );

  return { terms: combinedTerms };
};

exports.getUserStudyroom = async (userId) => {
  const studyrooms = await db.UserStudyroom.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: db.Studyroom,
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
      studyroom_id: encrypt62(studyroom.Studyroom.studyroom_id),
      title: studyroom.Studyroom.title,
      subtitle: studyroom.Studyroom.subtitle,
      area: studyroom.Studyroom.area_id,
      profile_image: studyroom.Studyroom.profile_image,
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
  const studyroomTodos = await db.StudyroomTodo.findAll({
    include: [
      {
        model: Todo,
        attributes: [
          "todo_id",
          "title",
          "content",
          "creater_id",
          "deadline",
          "status",
          "created_at",
          "updated_at",
        ],
        include: [
          {
            model: db.TodoParticipant,
            where: { assigned_user_id: userId },
            attributes: ["assigned_user_id", "status"],
          },
        ],
      },
    ],
  });

  const userTodos = await db.Todo.findAll({
    where: {
      creater_id: userId,
    },
    attributes: [
      "todo_id",
      "title",
      "content",
      "creater_id",
      "status",
      "created_at",
      "updated_at",
    ],
  });

  const todos = [...studyroomTodos, ...userTodos];

  if (!todos.length) {
    throw new NotExistsError("해당 사용자의 할 일이 없습니다.");
  }

  const ret = todos.map((todoEntry) => {
    let todo;
    let studyroomId = null;
    let assignedStatus = null;

    if (todoEntry instanceof StudyroomTodo) {
      todo = todoEntry.Todo;
      studyroomId = encrypt62(todoEntry.studyroom_id);
      assignedStatus = todoEntry.TodoParticipants[0]?.status;
    } else {
      todo = todoEntry;
    }

    return {
      type: studyroomId ? "studyroom" : "user", // 타입 설정
      studyroom_id: studyroomId || null, // 스터디룸 ID (없으면 null)
      todo_id: encrypt62(todo.todo_id), // 암호화된 todo ID
      title: todo.title,
      content: todo.content,
      location: todo.location || null, // 위치 필드 추가 (null일 경우)
      todo_status: todo.status, // enum (pending, done, deleted)
      my_status: assignedStatus || "pending", // 사용자의 상태 (기본값은 pending)
      starts_at: todo.starts_at || null, // 시작일 (null일 경우)
      ends_at: todo.ends_at || null, // 종료일 (null일 경우)
      creater_id: encrypt62(todo.creater_id), // 암호화된 생성자 ID
      participants: todoEntry.TodoParticipants
        ? todoEntry.TodoParticipants.map((participant) => ({
            id: encrypt62(participant.assigned_user_id), // 암호화된 참여자 ID
            nickname: participant.nickname, // 참여자 닉네임 (기본값은 Unknown)
          }))
        : [],
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    };
  });

  return ret;
};

exports.getTodoInfo = async (todoId) => {
  const todo = await db.Todo.findByPk(todoId, {
    attributes: [
      "todo_id",
      "title",
      "content",
      "location",
      "status",
      "start_at",
      "ends_at",
      "creater_id",
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
  const todo = await db.TodoParticipant.findAll({
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
  const userSpecs = await db.UserSpec.findAll({
    where: { user_id: userId },
    attributes: ["created_at"],
    include: [
      {
        model: db.Spec,
        attributes: ["spec_id", "title", "host", "spec_date", "content"],
        required: false, // LEFT OUTER JOIN 수행
        include: [
          {
            model: db.SpecPhoto,
            attributes: ["image_url", "sequence"],
            required: false,
          },
        ],
      },
    ],
  });
  if (!userSpecs) {
    throw new NotExistsError("해당 사용자의 스펙이 없습니다.");
  }
  // Spec 데이터만 추출
  const specs = userSpecs.map((us) => {
    const specData = us.Spec;
    return {
      spec_id: specData.spec_id,
      name: specData.title,
      host: specData.host,
      spec_date: specData.spec_date,
      content: specData.content,
      images: specData.SpecImages
        ? specData.SpecImages.map((image) => ({
            sequence: image.sequence,
            image_url: image.image_url,
          }))
        : [],
      created_at: us.created_at,
    };
  });

  logger.debug(
    `[getUserSpecsByUserIdService] 파싱된 스펙: ${JSON.stringify(
      specs,
      null,
      2
    )}`
  );

  return specs;
};

exports.getUserNeighborhoodsByUserId = async (userId) => {
  const userNeighborhoods = await db.UserArea.findAll({
    where: { user_id: userId },
    attributes: ["sequence"],
    include: [
      {
        model: db.Area,
        attributes: ["area_id", "sido", "gungu"],
        required: false,
      },
    ],
  });
  logger.debug(
    `[getUserNeighborhoodsByUserId] 해당 사용자의 동네를 가져옵니다: ${JSON.stringify(
      userNeighborhoods,
      null,
      2
    )}`
  );
  if (!userNeighborhoods) {
    throw new NotExistsError("해당 사용자의 동네가 없습니다.");
  }

  const neighborhoods = userNeighborhoods.map((un) => {
    const area = un.Area;
    return {
      sequence: un.sequence,
      sido: area.sido,
      gungu: area.gungu,
    };
  });

  return neighborhoods;
};

exports.getUserMyProfile = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: [
      "user_id",
      "name",
      "nickname",
      "nickname_changes",
      "birthdate",
      "phone_number",
      "email",
      "is_email_verified",
      "profile_image",
      "spec_level",
      "manner_score",
      "created_at",
    ],
  });
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  const userSchool = await db.UserSchool.findOne({
    where: { user_id: userId },
    attributes: ["school_id", "is_verified"],
    include: [
      {
        model: db.School,
        attributes: ["name"],
      },
    ],
  });

  const profile = {
    name: user.name,
    nickname: user.nickname,
    remaining_nickname_changes: remainingNicknameChanges,
    birthdate: user.birthdate,
    phone: user.phone_number,
    email: user.email,
    is_email_verified: user.is_email_verified || false,
    school: userSchool.name || null,
    is_school_verified: userSchool.is_verified || false,
    profile_image: user.profile_image,
    spec_level: user.spec_level,
    manner_score: user.manner_score,
    created_at: user.created_at,
  };

  return profile;
};

exports.getOtherUserProfile = async (otherUserId) => {
  const user = await db.User.findByPk(otherUserId, {
    attributes: [
      "user_id",
      "nickname",
      "birthdate",
      "phone_number",
      "email",
      "is_email_verified",
      "is_email_public",
      "profile_image",
      "website",
      "description",
      "spec_level",
      "manner_score",
      "created_at",
    ],
    include: [
      {
        model: db.UserArea,
        as: "user_areas",
        attributes: ["sequence"],
        include: [
          {
            model: db.Area,
            as: "area",
            attributes: ["sido", "gungu"],
          },
        ],
      },
      {
        model: db.UserSpec,
        as: "user_specs",
        attributes: ["spec_id"],
        include: [
          {
            model: db.Spec,
            as: "spec",
            attributes: ["name", "host", "spec_date", "status", "content"],
          },
        ],
      },
      {
        model: db.UserSchool,
        as: "user_schools",
        attributes: ["school_id", "is_verified", "is_public"],
        include: [
          {
            model: db.School,
            as: "school",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  const publicProfile = {
    ...user.toJSON(),
    nickname: user.nickname,
    phone: user.phone_number,
    email: user.is_email_public ? email : null,
    is_email_verified: user.is_email_verified,
    school: user.user_schools.is_public ? user.user_schools.school.name : null,
    is_school_verified: user.user_schools.is_verified,
    profile_image: user.profile_image,
    website: user.website,
    introduction: user.description,
    areas: user.user_areas.map((area) => ({
      sequence: area.sequence,
      sido: area.Area.sido,
      gungu: area.Area.gungu,
    })),
    spec_level: user.spec_level,
    specs: user.user_specs.map((spec) => {
      return spec.status === "private"
        ? null
        : {
            name: spec.Spec.name,
            host: spec.Spec.host,
            spec_date: spec.Spec.spec_date,
            content: spec.Spec.content,
          };
    }),
    manner_score: user.manner_score,
    created_at: user.created_at,
  };

  return publicProfile;
};

exports.editUserEmail = async (userInfo) => {
  const { userId, email } = userInfo;
  logger.debug(`[editUserEmail] userId: ${userId}, email: ${email}`);
  const [updatedCount] = await db.User.update(
    { email },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 이메일과 동일해 수정되지 않았습니다.");
  }
  return { updatedCount };
};

exports.editUserProfileImage = async (userInfo) => {
  const { userId, profileImage } = userInfo;
  logger.debug(
    `[editUserProfileImage] userId: ${userId}, profileImage: ${profileImage}`
  );
  const [updatedCount] = await db.User.update(
    { profile_image: profileImage },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 프로필 이미지와 동일해 수정되지 않았습니다.");
  }
  return { updatedCount };
};

exports.editUserNickname = async (userInfo) => {
  const { userId, nickname } = userInfo;
  logger.debug(`[editUserNickname] userId: ${userId}, nickname: ${nickname}`);
  const [updatedCount] = await db.User.update(
    { nickname },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 닉네임과 동일해 수정되지 않았습니다.");
  }
  return { updatedCount };
};

exports.checkIfUserExistsByUserId = async (userId) => {
  const user = await db.User.findByPk(userId, { attributes: ["user_id"] });
  logger.debug(
    `[checkIfUserExistsByUserIdService] user: ${JSON.stringify(user, null, 2)}`
  );
  if (!user) {
    throw new NotExistsError("해당 사용자가 존재하지 않습니다.");
  }

  return user;
};
