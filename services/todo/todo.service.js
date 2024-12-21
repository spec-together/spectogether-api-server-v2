const todoRepository = require("../../repositories/todo.repository");
const { Studyroom } = require("../../models"); // TODO : 리포 구현
const { NotExistsError, InvalidInputError } = require("../../errors");

// 입력 데이터 검증 함수
const validateCreateTodo = (data) => {
  const { title, status, deadline, subtitle, content, studyroom_id } = data;

  if (typeof title !== "string" || title.trim() === "") {
    throw new InvalidInputError("제목은 필수 입력 항목입니다.");
  }

  const validStatuses = ["pending", "in_progress", "completed"];
  if (!validStatuses.includes(status)) {
    throw new InvalidInputError(
      `상태는 ${validStatuses.join(", ")} 중 하나여야 합니다.`
    );
  }

  if (isNaN(Date.parse(deadline))) {
    throw new InvalidInputError("유효한 마감일을 입력해주세요.");
  }

  if (typeof subtitle !== "string" || subtitle.trim() === "") {
    throw new InvalidInputError("부제목은 필수 입력 항목입니다.");
  }

  if (typeof content !== "string" || content.trim() === "") {
    throw new InvalidInputError("내용은 필수 입력 항목입니다.");
  }

  if (!Number.isInteger(studyroom_id) || studyroom_id <= 0) {
    throw new InvalidInputError("유효한 스터디룸 ID를 입력해주세요.");
  }
};

const validateUpdateTodo = (data) => {
  const { title, status, deadline, subtitle, content, studyroom_id } = data;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new InvalidInputError(
        "제목은 문자열이어야 하며 비어있을 수 없습니다."
      );
    }
  }

  if (status !== undefined) {
    const validStatuses = ["pending", "in_progress", "completed"];
    if (!validStatuses.includes(status)) {
      throw new InvalidInputError(
        `상태는 ${validStatuses.join(", ")} 중 하나여야 합니다.`
      );
    }
  }

  if (deadline !== undefined) {
    if (isNaN(Date.parse(deadline))) {
      throw new InvalidInputError("유효한 마감일을 입력해주세요.");
    }
  }

  if (subtitle !== undefined) {
    if (typeof subtitle !== "string" || subtitle.trim() === "") {
      throw new InvalidInputError(
        "부제목은 문자열이어야 하며 비어있을 수 없습니다."
      );
    }
  }

  if (content !== undefined) {
    if (typeof content !== "string" || content.trim() === "") {
      throw new InvalidInputError(
        "내용은 문자열이어야 하며 비어있을 수 없습니다."
      );
    }
  }

  if (studyroom_id !== undefined) {
    if (!Number.isInteger(studyroom_id) || studyroom_id <= 0) {
      throw new InvalidInputError("유효한 스터디룸 ID를 입력해주세요.");
    }
  }
};

const createTodoService = async (todoData) => {
  validateCreateTodo(todoData);
  const newTodo = await todoRepository.createTodo(todoData);
  return newTodo;
};
// const createTodoService = async (todoData, studyroom_id) => {
//   const studyroom = await Studyroom.findByPk(studyroom_id);
//   if (!studyroom) {
//     throw new NotExistsError("스터디룸을 찾을 수 없습니다.");
//   }

//   const todo = await todoRepository.createTodo(todoData);
//   await todoRepository.addTodoMember(todo.todo_id, todo.creater_id);
//   await todoRepository.addStudyroomTodo(todo.studyroom_id, todo.todo_id);
//   // TODO : 모든 경우에 transaction 처리를 해야하는지 고민해보기
//   return todo;
// };

const getAllTodosService = async (page, limit, studyroomId = null) => {
  if (
    studyroomId &&
    (!Number.isInteger(Number(studyroomId)) || studyroomId <= 0)
  ) {
    throw new InvalidInputError("유효한 스터디룸 ID를 입력해주세요.");
  }

  const offset = (page - 1) * limit;
  const { todos, count } = await todoRepository.getAllTodos(
    limit,
    offset,
    studyroomId
  );
  const total_pages = Math.ceil(count / limit);

  return {
    todos,
    pagination: {
      total_items: count,
      total_pages,
      page,
      limit,
      next: page < total_pages ? `/todos?page=${page + 1}` : null,
      previous: page > 1 ? `/todos?page=${page - 1}` : null,
    },
  };
};

const getTodoByIdService = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new InvalidInputError("유효한 Todo ID를 입력해주세요.");
  }

  const todo = await todoRepository.getTodoById(id);
  if (!todo) {
    throw new NotExistsError("Todo를 찾을 수 없습니다.");
  }
  return todo;
};

const updateTodoService = async (id, updateData) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new InvalidInputError("유효한 Todo ID를 입력해주세요.");
  }

  validateUpdateTodo(updateData);

  const updatedTodo = await todoRepository.updateTodo(id, updateData);
  if (!updatedTodo) {
    throw new NotExistsError("Todo를 업데이트할 수 없습니다.");
  }
  return updatedTodo;
};

const deleteTodoService = async (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new InvalidInputError("유효한 Todo ID를 입력해주세요.");
  }

  const result = await todoRepository.deleteTodo(id);
  if (!result) {
    throw new NotExistsError("Todo를 삭제할 수 없습니다.");
  }
};

module.exports = {
  createTodoService,
  getAllTodosService,
  getTodoByIdService,
  updateTodoService,
  deleteTodoService,
};
