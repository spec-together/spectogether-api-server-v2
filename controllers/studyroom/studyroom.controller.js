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
    res.status(200).json(studyroom);
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
