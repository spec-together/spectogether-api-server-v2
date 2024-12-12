// routes/emailVerificationRoutes.js
const express = require("express");
const {
  sendVerificationEmailHandler,
  verifyEmailHandler,
} = require("../controllers/emailVerificationController");
const { checkEmail } = require("../middlewares/emailMiddleware");

const router = express.Router();

// POST /api-test/send-verification-email
router.post(
  "/send-verification-email",
  checkEmail,
  sendVerificationEmailHandler
);

// POST /api-test/verify-email
router.post("/verify-email", verifyEmailHandler);

module.exports = router;
