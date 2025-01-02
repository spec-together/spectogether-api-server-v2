const studyroomService = require("../../services/studyroom/studyroom.service.js");
// const logger = require("../../logger");

exports.getAllStudyrooms = async (req, res, next) => {
  try {
    const studyrooms = await studyroomService.getAllStudyrooms();
    res.status(200).success({
      message: "스터디룸 목록 조회 성공",
      studyrooms,
      // pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudyroomByStudyroomId = async (req, res, next) => {
  try {
    const studyroom = await studyroomService.getStudyroomByStudyroomId(
      req.params.id
    );
    res.status(200).success(studyroom);
  } catch (error) {
    next(error);
  }
};

exports.createStudyroom = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const uploadedStudyroomProfileImage = req.file;
    const result = await studyroomService.createStudyroom({
      user_id: userId,
      title: req.body.title,
      subtitle: req.body.subtitle,
      area_id: req.body.area_id,
      profile_image: uploadedStudyroomProfileImage
        ? uploadedStudyroomProfileImage.path
        : "",
      goal: req.body.goal,
      goal_url: req.body.goal_url,
      todos: req.body.todos,
    });
    return res
      .status(201)
      .success({ message: result.message, studyroom_id: result.studyroom_id });
  } catch (error) {
    next(error);
  }
};

exports.joinStudyroom = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const result = await studyroomService.joinStudyroom({
      user_id: userId,
      studyroom_id: req.params.studyroomId,
    });
    return res
      .status(201)
      .success({ message: result.message, studyroom_id: result.studyroom_id });
  } catch (error) {
    next(error);
  }
};

// exports.updateStudyroom = async (req, res, next) => {};

exports.deleteStudyroom = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const result = await studyroomService.deleteStudyroom({
      userId,
      studyroomId: req.params.studyroomId,
    });
    return res.status(200).success({ message: result.message });
  } catch (error) {
    next(error);
  }
};

exports.getTodosByStudyroomId = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const studyroomId = parseInt(req.params.studyroomId);
    const todos = await studyroomService.getTodosByStudyroomId({
      userId,
      studyroomId,
    });
    return res
      .status(200)
      .success({ message: "스터디룸의 할일 목록 조회 성공", todos });
  } catch (error) {
    next(error);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const studyroomId = parseInt(req.params.studyroomId);
    const { title, content, location, starts_at, ends_at } = req.body;
    const result = await studyroomService.createTodo({
      userId,
      studyroomId,
      title,
      content,
      location,
      starts_at,
      ends_at,
    });
    return res
      .status(201)
      .success({ message: result.message, todo_id: result.todo_id });
  } catch (error) {
    next(error);
  }
};

exports.joinTodo = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const studyroomId = parseInt(req.params.studyroomId);
    const todoId = parseInt(req.params.todoId);
    const result = await studyroomService.joinTodo({
      userId,
      studyroomId,
      todoId,
    });
    return res
      .status(201)
      .success({ message: result.message, todo_id: result.todo_id });
  } catch (error) {
    next(error);
  }
};

exports.submitTodo = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const studyroomId = parseInt(req.params.studyroomId);
    const todoId = parseInt(req.params.todoId);
    const uploadedImage = req.file;
    const { comment } = req.body;
    const result = await studyroomService.submitTodo({
      userId,
      studyroomId,
      todoId,
      comment,
      image_url: uploadedImage ? uploadedImage.path : "",
    });
    return res
      .status(200)
      .success({ message: result.message, todo_id: result.todo_id });
  } catch (error) {
    next(error);
  }
};

exports.getMembersByStudyroomId = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const studyroomId = parseInt(req.params.studyroomId);
    const members = await studyroomService.getMembersByStudyroomId({
      userId,
      studyroomId,
    });
    return res
      .status(200)
      .success({ message: "스터디룸의 멤버 목록 조회 성공", members });
  } catch (error) {
    next(error);
  }
};
