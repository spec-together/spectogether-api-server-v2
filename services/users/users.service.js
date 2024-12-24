const { NotExistsError, DatabaseError } = require("../../errors");
const logger = require("../../logger");
const { encrypt62 } = require("../../utils/encrypt.util");
const db = require("../../models");

exports.getUserAgreedTerms = async (userId) => {
  const currentTerms = await db.Term.findAll({
    where: { status: true },
    attributes: [
      "term_id",
      "name",
      "description",
      "is_required",
      "term_version",
    ],
  });
  if (!currentTerms.length) {
    throw new NotExistsError("현행 약관이 존재하지 않습니다.");
  }
  const userAgreedTerms = await db.UserTerm.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["term_id", "is_agreed"],
  });
  const combinedTerms = currentTerms.map((term) => {
    const userAgreed = userAgreedTerms.find(
      (ut) => ut.term_id === term.term_id
    );
    return {
      id: term.term_id,
      name: term.name,
      description: term.description,
      is_required: term.is_required,
      version: term.term_version,
      user_agreed: userAgreed ? userAgreed.is_agreed : false,
    };
  });

  logger.debug(
    `[getUserAgreedTermsService] 사용자 ID ${userId}의 약관 동의 정보: ${JSON.stringify(
      combinedTerms,
      null,
      2
    )}`
  );

  return { terms: combinedTerms };
};

exports.checkIfUserExistsByUserId = async (userId) => {
  const user = await db.User.findByPk(userId, { attributes: ["user_id"] });
  logger.debug(
    `[checkIfUserExistsByUserIdService] user: ${JSON.stringify(user, null, 2)}`
  );
  if (!user) {
    throw new NotExistsError("해당 사용자가 존재하지 않습니다.");
  }

  return user;
};
