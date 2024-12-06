const { NotExistsError } = require("../errors");
const logger = require("../logger");
const { getAgreedTermsByUserId } = require("../repositories/users.repository");

const getUserAgreedTermsService = async (user_id) => {
  const userAgreedTerms = await getAgreedTermsByUserId(user_id);
  logger.debug(
    `[getUserAgreedTermsService] 해당 사용자의 동의한 약관을 가져옵니다: ${JSON.stringify(
      userAgreedTerms,
      null,
      2
    )}`
  );
  if (!userAgreedTerms) {
    throw new NotExistsError("해당 사용자의 동의한 약관이 없습니다.");
  }

  let ret = [];

  for (const term of userAgreedTerms) {
    // TIP :for ~ in 과 for ~ of 의 차이는?
    ret.push({
      term_id: term.term_id,
      is_agreed: term.is_agreed,
      last_agreed_at: term.updated_at,
    });
  }

  return ret;
};

module.exports = {
  getUserAgreedTermsService,
};
