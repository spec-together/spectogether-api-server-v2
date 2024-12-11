const contestService = require("../services/contest.service.js");
// const { successResponse, errorResponse } = require("../utils/response");

exports.getAllContests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    // const { page = 1, limit = 10 } = req.query;
    const result = await contestService.getAllContests(page, limit);
    const { contests, pagination } = result;
    return res.status(200).success({
      contests,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContestById = async (req, res, next) => {
  try {
    const contestId = parseInt(req.params.id, 10);
    const contest = await contestService.getContestById(contestId);
    return res.status(200).success({ contest });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// exports.createContest = async (req, res, next) => {
//   try {
//     const data = req.body;
//     const newContest = await contestService.createContest(data);
//     return successResponse(res, "대회를 성공적으로 생성했습니다.", newContest);
//   } catch (error) {
//     return errorResponse(res, error);
//   }
// };

exports.createContestWithAssociations = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      host,
      location,
      online_offline_type,
      application_start_date,
      application_end_date,
      start_date,
      end_date,
    } = req.body;
    const result = await contestService.createContestWithAssociations({
      title,
      subtitle,
      description,
      host,
      location,
      online_offline_type,
      application_start_date,
      application_end_date,
      start_date,
      end_date,
    });
    return res.status(201).success({
      contest: result.contest,
      contestCalendar: result.contestCalendar,
      contestBoard: result.contestBoard,
      message: "대회를 성공적으로 생성했습니다.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 추가적인 컨트롤러 메서드 구현...
