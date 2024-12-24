const logger = require("../../logger");

const logError = (err) => {
  logger.error(`NAME ${err.name}\
      \nREASON ${JSON.stringify(err.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(err.message, null, 2)}\
      \nSTACK ${err.stack}`);
};

module.exports = {
  logError,
};
