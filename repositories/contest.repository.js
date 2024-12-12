const {
  Board,
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
    order: [["created_at", "DESC"]],
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
  // Contest, Calender, ContestCalendar, ContestBoard
  const t = await sequelize.transaction();
  try {
    const contest = await Contest.create(contestData, { transaction: t });
    const calendar = await Calendar.create({}, { transaction: t });
    const contestCalendar = await ContestCalendar.create(
      {
        contest_id: contest.contest_id,
        calendar_id: calendar.calendar_id,
      },
      { transaction: t }
    );
    const board = await Board.create(
      {
        title: `${contest.title} 게시판입니다.`,
        content: `${contest.title} 관련 내용을 주제로 합니다.`,
        author: 1, // TODO: 현재 임시 설정한 값을 admin 값으로 변경 고려
        image_url: "https://via.placeholder.com/150", // TODO : test 값 삭제
      },
      { transaction: t }
    );
    const contestBoard = await ContestBoard.create(
      {
        contest_id: contest.contest_id,
        board_id: board.board_id,
      },
      { transaction: t }
    );

    await t.commit();
    return { contest, calendar, contestCalendar, board, contestBoard };
  } catch (error) {
    console.error(error);
    await t.rollback();
    throw error; // 에러를 서비스 계층으로 전파
  }
};

module.exports = {
  findAllContests,
  findContestById,
  // createContest,
  createContestWithAssociations,
};
