const { NotExistsError } = require("../errors");
const logger = require("../logger");
const {
  getAgreedTermsByUserId,
  getUserTodoByUserId,
  getUserStudyroomByUserId,
  getUserSpecsByUserId,
} = require("../repositories/users.repository");

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
      studyroom_id: studyroom.studyroom_id,
      title: studyroom.title,
      description: studyroom.description,
      status: studyroom.status,
      created_at: studyroom.created_at,
    });
  }

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
  const specs = userSpecs.map((us) => us.Spec).filter((spec) => spec !== null);

  return specs;
};

module.exports = {
  getUserAgreedTermsService,
  getUserStudyroomService,
  getUserTodoService,
  getUserSpecsByUserIdService,
};
