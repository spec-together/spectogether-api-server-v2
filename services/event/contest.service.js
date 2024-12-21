const contestRepository = require("../../repositories/contest.repository.js");
const {
  DatabaseError,
  NotExistsError,
  InvalidInputError,
} = require("../../errors");
const { validateContestInput } = require("../../utils/validators/event.validators");

const validateDates = ({
  application_start_date,
  application_end_date,
  start_date,
  end_date,
}) => {
  const appStart = new Date(application_start_date);
  const appEnd = new Date(application_end_date);
  const start = new Date(start_date);
  const end = new Date(end_date);
  const now = new Date();

  if (appStart < now) {
    throw new InvalidInputError("모집 시작일은 현재 시간 이후여야 합니다.");
  }

  if (appStart >= appEnd) {
    throw new InvalidInputError(
      "모집 시작일은 모집 종료일보다 이전이어야 합니다."
    );
  }

  if (appEnd >= start) {
    throw new InvalidInputError(
      "모집 종료일은 대회 시작일보다 이전이어야 합니다."
    );
  }

  if (start >= end) {
    throw new InvalidInputError("대회 시작일은 종료일보다 이전이어야 합니다.");
  }
};

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

const createContestWithAssociations = async (contestData) => {
  try {
    validateContestInput(contestData); // 입력값 검증
    validateDates(contestData); // 날짜 유효성 검증

    const { contest, calendar, contestCalendar, contestBoard } =
      await contestRepository.createContestWithAssociations(contestData); // 리포지토리 호출

    return { contest, contestCalendar, contestBoard }; // 필요한 데이터만 반환
  } catch (error) {
    // console.error("대회 생성 중 에러", error);
    if (error instanceof InvalidInputError) {
      throw error;
    }
    throw new DatabaseError("대회를 생성하는 중 오류가 발생했습니다.");
  }
};

module.exports = {
  getAllContests,
  getContestById,
  createContestWithAssociations,
};
