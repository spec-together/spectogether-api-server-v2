const { Studyroom } = require("../models");

const createStudyroomWithContestId = async (contestId, studyroomData) => {
  const studyroom = await Studyroom.create({
    contest_id: contestId,
    spec_id: null,
    ...studyroomData,
  });
  return studyroom;
};

const createStudyroomWithSpecId = async (specId, studyroomData) => {
  const studyroom = await Studyroom.create({
    contest_id: null,
    spec_id: specId,
    ...studyroomData,
  });
  return studyroom;
};

module.exports = {
  createStudyroomWithContestId,
  createStudyroomWithSpecId,
};
