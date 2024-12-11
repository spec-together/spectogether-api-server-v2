const contestRepository = require("../repositories/contest.repository.js");
const { DatabaseError, NotExistsError } = require("../errors");

const getAllContests = async (page, limit) => {
  const offset = (page - 1) * limit;

  try {
    const { contests, totalItems } = await contestRepository.findAllContests(
      limit,
      offset
    );
    const totalPages = Math.ceil(totalItems / limit);

    return {
      contests,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        page,
        limit,
        next: page < totalPages ? `/contests?page=${page + 1}` : null,
        previous: page > 1 ? `/contests?page=${page - 1}` : null,
      },
    };
  } catch (error) {
    // console.log(error);
    throw new DatabaseError("대회 목록을 가져오는 중 오류가 발생했습니다.");
  }
};

const getContestById = async (contestId) => {
  if (isNaN(contestId)) {
    throw new InvalidInputError("유효한 대회 ID를 입력해주세요.");
  }

  try {
    const contest = await contestRepository.findContestById(contestId);
    if (!contest) {
      throw new NotExistsError("해당 대회가 존재하지 않습니다.");
    }
    return contest;
  } catch (error) {
    throw new DatabaseError("대회를 가져오는 중 오류가 발생했습니다.");
  }
};

// const createContest = async (data) => {return contestRepository.createContest(data)};
const createContestWithAssociations = async (contestData) => {
  try {
    const {} =
      await contestRepository.createContestWithAssociations(contestData);
    return { contest, contestCalendar, contestBoard };
  } catch (error) {
    console.error(error);
    throw new DatabaseError("대회를 생성하는 중 오류가 발생했습니다.");
  }
};

module.exports = {
  getAllContests,
  getContestById,
  // createContest,
  createContestWithAssociations,
};
