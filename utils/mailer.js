const nodemailer = require("nodemailer");
const config = require("../config.json");
const { GOOGLE_EMAIL, GOOGLE_EMAIL_PASSWORD } = config.MAILER;

// 이메일 전송 함수
async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GOOGLE_EMAIL,
      pass: GOOGLE_EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `메일 인증 <${GOOGLE_EMAIL}>`,
    to: email,
    subject: "가입 인증 메일",
    html: `인증 코드: ${token}`,
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendVerificationEmail;
