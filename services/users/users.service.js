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

exports.getUserTodo = async (userId) => {
  const studyroomTodos = await db.StudyroomTodo.findAll({
    attributes: ["studyroom_id"],
    include: [
      {
        model: db.Todo,
        as: "todo",
        attributes: [
          "todo_id",
          "title",
          "content",
          "location",
          "status", // todo_status: "enum (pending, done, deleted)"
          "starts_at",
          "ends_at",
          "creater_id",
          "created_at",
          "updated_at",
        ],
        include: [
          {
            model: db.TodoParticipant,
            as: "todo_participants",
            where: { assigned_user_id: userId },
            attributes: ["assigned_user_id", "status"], // my_status: "enum (pending, abandoned, done)"
          },
        ],
      },
    ],
  });

  const userTodos = await db.UserTodo.findAll({
    where: { user_id: userId },
    attributes: ["todo_id"],
    include: [
      {
        model: db.Todo,
        as: "todo",
        attributes: [
          "todo_id",
          "title",
          "content",
          "location",
          "status",
          "starts_at",
          "ends_at",
          "creater_id",
          "created_at",
          "updated_at",
        ],
      },
    ],
  });

  const todos = [...studyroomTodos, ...userTodos].map((todoEntry) => {
    const isStudyroomTodo = !!todoEntry.studyroom_id;
    const todo = todoEntry.todo;

    return {
      type: isStudyroomTodo ? "studyroom" : "user",
      studyroom_id: isStudyroomTodo ? encrypt62(todoEntry.studyroom_id) : null,
      todo_id: todo?.todo_id,
      title: todo?.title,
      content: todo?.content,
      location: todo?.location,
      todo_status: todo?.status,
      my_status: isStudyroomTodo
        ? todo?.todo_participants?.[0]?.status || null
        : null,
      starts_at: todo?.starts_at,
      ends_at: todo?.ends_at,
      creater_id: todo?.creater_id,
      participants: isStudyroomTodo
        ? todo?.todo_participants?.map((participant) => ({
            id: participant.assigned_user_id,
            nickname: participant.nickname || null,
          })) || []
        : [],
      created_at: todo?.created_at,
      updated_at: todo?.updated_at,
    };
  });

  if (!todos.length) {
    throw new NotExistsError("해당 사용자의 할 일이 없습니다.");
  }

  return todos;
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
        as: "spec",
        attributes: ["spec_id", "name", "host", "spec_date", "content"],
        required: false, // LEFT OUTER JOIN 수행
        include: [
          {
            model: db.SpecPhoto,
            as: "spec_photos",
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
    const specData = us.spec;
    return {
      spec_id: specData.spec_id,
      name: specData.name,
      host: specData.host,
      spec_date: specData.spec_date,
      content: specData.content,
      images: specData.spec_photos.map((image) => ({
        sequence: image.sequence,
        image_url: image.image_url,
      })),
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
        as: "area",
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
    const area = un.area;
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
    include: [
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

  const profile = {
    user_id: user.user_id,
    name: user.name,
    nickname: user.nickname,
    remaining_nickname_changes: 2 - user.nickname_changes,
    birthdate: user.birthdate,
    phone: user.phone_number,
    email: user.email,
    is_email_verified: user.is_email_verified,
    school: user.user_schools?.[0]?.school?.name,
    is_school_verified: user.user_schools?.[0]?.is_verified,
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
      return spec.spec.status === "private"
        ? null
        : {
            name: spec.spec.name,
            host: spec.spec.host,
            spec_date: spec.spec.spec_date,
            content: spec.spec.content,
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
    {
      nickname: nickname,
    },
    { where: { user_id: userId } }
  );
  if (updatedCount === 0) {
    throw new DatabaseError("기존 닉네임과 동일해 수정되지 않았습니다.");
  }
  return updatedCount;
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
