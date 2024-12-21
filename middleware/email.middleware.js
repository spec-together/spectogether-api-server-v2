// middlewares/emailMiddleware.js
const { User } = require("../models/index");

const checkEmail = async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: { email: req.body.email },
      attributes: ["email"],
    });
    if (exUser) {
      return res.status(409).json({
        code: 409,
        message: "사용할 수 없는 이메일입니다.",
      });
    } else {
      next();
    }
  } catch (e) {
    res.status(500).json({ code: 500, message: "이메일 확인 중 서버 에러" });
  }
};

module.exports = {
  checkEmail,
};
