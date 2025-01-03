const studyroomService = require("../../services/studyroom/studyroom.service.js");
const logger = require("../../logger");
const uploadService = require("../../services/upload/upload.service.js");

exports.getAllStudyrooms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await studyroomService.getAllStudyrooms({ page, limit });
    // const studyrooms = await studyroomService.getAllStudyrooms();
    res.status(200).success({
      message: result.message,
      studyrooms: result.studyrooms,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudyroomByStudyroomId = async (req, res, next) => {
  try {
    const studyroom = await studyroomService.getStudyroomByStudyroomId(
      req.params.studyroomId
    );
    res.status(200).success(studyroom);
  } catch (error) {
    next(error);
  }
};

exports.createStudyroom = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    // 1. 파일 존재 여부 로깅 // logger.debug(`[createStudyroom] req.file 존재 여부: ${!!req.file}`);
    // 2. 파일 정보 전체 로깅 // if (req.file) { logger.debug(`[createStudyroom] req.file: ${JSON.stringify(req.file, null, 2)}`);}
    const imageUrl = req.file
      ? uploadService.getCloudfrontUrl(req.file.key)
      : ""; // null 대신 빈 문자열로
    // 3. 최종 URL 로깅 // logger.debug(`[createStudyroom] imageUrl: ${imageUrl}`);
    const result = await studyroomService.createStudyroom({
      user_id: userId,
      title: req.body.title,
      subtitle: req.body.subtitle,
      area_id: req.body.area_id,
      profile_image: imageUrl,
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
    const studyroomId = parseInt(req.params.studyroomId);
    const result = await studyroomService.joinStudyroom({
      user_id: userId,
      studyroom_id: studyroomId,
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
    const imageUrl = uploadedImage
      ? uploadService.getCloudfrontUrl(uploadedImage.key)
      : ""; // null 대신 빈 문자열로
    const { comment } = req.body;
    const result = await studyroomService.submitTodo({
      userId,
      studyroomId,
      todoId,
      comment,
      image_url: imageUrl,
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

exports.inviteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const studyroomId = parseInt(req.params.studyroomId);
    const inviteePhone = req.body.invitee_phone; // const { email } = req.body;

    const result = await studyroomService.inviteUser({
      inviterId: userId,
      studyroomId,
      inviteePhone,
    });
    return res.status(200).success({ message: result.message });
  } catch (error) {
    next(error);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const inviteId = parseInt(req.params.inviteId);
    const result = await studyroomService.acceptInvitation({
      userId,
      inviteId,
    });
    return res.status(200).success({ message: result.message });
  } catch (error) {
    next(error);
  }
};

exports.getReceivedInvites = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const result = await studyroomService.getReceivedInvites({ userId });
    return res
      .status(200)
      .success({ message: result.message, invites: result.invites });
  } catch (error) {
    next(error);
  }
};
