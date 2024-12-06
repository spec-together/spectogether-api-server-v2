const { UserTerm } = require("../models");

const getAgreedTermsByUserId = async (userId) => {
  const terms = await UserTerm.findAll({
    where: {
      user_id: userId,
    },
  });

  return terms;
};

module.exports = {
  getAgreedTermsByUserId,
};
