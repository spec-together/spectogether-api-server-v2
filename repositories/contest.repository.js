const {
  Calendar,
  Contest,
  ContestBoard,
  ContestCalendar,
  sequelize,
} = require("../models/index.js");

// TODO : contest qna 도 함께 가져오기

const findAllContests = async (limit, offset) => {
  const { rows, count } = await Contest.findAndCountAll({
    limit,
    offset,
    include: [ContestBoard, ContestCalendar],
  });
  return { contests: rows, totalItems: count };
};

const findContestById = async (id) => {
  const contest = await Contest.findByPk(id, {
    // findOne() 대신 findByPk() 사용 ?
    include: [ContestBoard, ContestCalendar],
  });
  return contest;
};

const createContestWithAssociations = async (contestData) => {
  // return Contest.create(contestData);
  return sequelize.transaction(async (t) => {
    const contest = await Contest.create(contestData, { transaction: t });

    const calendar = await Calendar.create({ transaction: t });

    const contestCalendar = await ContestCalendar.create(
      {
        contest_id: contest.contest_id,
        calendar_id: calendar.calendar_id,
      },
      { transaction: t }
    );

    const contestBoard = await ContestBoard.create({ transaction: t });

    return { contest, contestCalendar, contestBoard };
  });
};

module.exports = {
  findAllContests,
  findContestById,
  // createContest,
  createContestWithAssociations,
};
