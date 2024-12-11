const { NotExistsError, DatabaseError } = require("../errors");
const logger = require("../logger");
const {
  getAgreedTermsByUserId,
  getUserTodoByUserId,
  getUserStudyroomByUserId,
  getUserSpecsByUserId,
  getUserNeighborhoodsByUserId,
  getSensitiveUserProfileByUserId,
  getInsensitiveUserProfileByUserId,
  updateUserProfileImageByUserId,
  updateUserNicknameByUserId,
  checkIfUserExistsByUserId,
} = require("../repositories/users.repository");
const { encrypt62 } = require("./encrypt.service");

const getUserAgreedTermsService = async (user_id) => {
  const userAgreedTerms = await getAgreedTermsByUserId(user_id);
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

const getUserStudyroomService = async (userId) => {
  const studyrooms = await getUserStudyroomByUserId(userId);
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

const getUserTodoService = async (userId) => {
  const todos = await getUserTodoByUserId(userId);
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
      creater_id: todo.creater_id,
      deadline: todo.deadline,
      status: todo.status,
      created_at: todo.created_at,
      assigned_user_id: userId,
      assigned_status: todo.TodoMembers[0]?.status,
    });
  }

  return ret;
};

const getUserSpecsByUserIdService = async (userId) => {
  const userSpecs = await getUserSpecsByUserId(userId);
  logger.debug(
    `[getUserSpecsByUserIdService] 해당 사용자의 스펙을 가져옵니다: ${JSON.stringify(
      userSpecs,
      null,
      2
    )}`
  );
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

const getUserNeighborhoodsByUserIdService = async (userId) => {
  const userNeighborhoods = await getUserNeighborhoodsByUserId(userId);
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

const getUserMyProfileService = async (userId) => {
  const user = await getSensitiveUserProfileByUserId(userId);
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  return user;
};

const getOtherUserProfileService = async (otherUserId) => {
  const user = await getInsensitiveUserProfileByUserId(otherUserId);
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  return user;
};

const editUserInfoService = async (userId, type, content) => {
  logger.debug(
    `[editUserInfoService] userId: ${userId}, type: ${type}, content: ${content}`
  );
  if (type === "profile_image") {
    const updatedUser = await updateUserProfileImageByUserId(userId, content);
    if (updatedUser === 0) {
      throw new DatabaseError("기존값과 동일해 정보가 수정되지 않았습니다.");
    }

    return updatedUser;
  } else if (type === "nickname") {
    const updatedUser = await updateUserNicknameByUserId(userId, content);
    if (updatedUser === 0) {
      throw new DatabaseError("기존값과 동일해 정보가 수정되지 않았습니다.");
    }

    return updatedUser;
  }
  return result;
};

const checkIfUserExistsByUserIdService = async (userId) => {
  const user = await checkIfUserExistsByUserId(userId);
  logger.debug(
    `[checkIfUserExistsByUserIdService] user: ${JSON.stringify(user, null, 2)}`
  );
  if (!user) {
    throw new NotExistsError("해당 사용자가 존재하지 않습니다.");
  }

  return user;
};

module.exports = {
  getUserAgreedTermsService,
  getUserStudyroomService,
  getUserTodoService,
  getUserSpecsByUserIdService,
  getUserNeighborhoodsByUserIdService,
  getUserMyProfileService,
  getOtherUserProfileService,
  editUserInfoService,
  checkIfUserExistsByUserIdService,
};
