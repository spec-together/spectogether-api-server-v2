const contestService = require("../services/event/contest.service.js");
const logger = require("../logger");

exports.getAllContests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    // const { page = 1, limit = 10 } = req.query;
    const result = await contestService.getAllContests(page, limit);
    return res.status(200).success({
      contests: result.contests,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error(`[getAllContests] Error: ${error.stack}`);
    next(error);
  }
};

exports.getContestById = async (req, res, next) => {
  try {
    const contestId = parseInt(req.params.id, 10);
    const contest = await contestService.getContestById(contestId);
    return res.status(200).success({ contest });
  } catch (error) {
    logger.error(`[getContestById] Error: ${error.stack}`);
    next(error);
  }
};

exports.createContestWithAssociations = async (req, res, next) => {
  try {
    logger.debug(
      `[createContestWithAssociations] Request body: ${JSON.stringify(req.body)}`
    );

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

    const locationObj =
      typeof location === "string" ? JSON.parse(location) : location;

    const contestData = {
      title,
      subtitle,
      description,
      host,
      location: locationObj,
      online_offline_type,
      application_start_date,
      application_end_date,
      start_date,
      end_date,
    };

    if (contestData.application_url === "") {
      contestData.application_url = null;
    }

    let image_url = null;

    if (req.file) {
      image_url = `${req.protocol}://${req.get("host")}/uploads/contests/${req.file.filename}`;
      logger.debug(
        `[createContestWithAssociations] Image uploaded: ${image_url}`
      );
    }

    const result = await contestService.createContestWithAssociations({
      ...contestData,
      image_url,
    });

    logger.info(
      `[createContestWithAssociations] Contest created: ${result.contest.contest_id}`
    );
    return res.status(201).success({
      contest: result.contest,
      contestCalendar: result.contestCalendar,
      contestBoard: result.contestBoard,
      message: "대회를 성공적으로 생성했습니다.",
    });
  } catch (error) {
    logger.error(`[createContestWithAssociations] Error: ${error.stack}`);
    next(error);
  }
};

// 추가적인 컨트롤러 메서드 구현...
