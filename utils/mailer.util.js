const nodemailer = require("nodemailer");
const config = require("../config.json");
const mailerConfig = config.MAILER;
const { EmailSendingError } = require("../errors");

// 이메일 전송 함수
async function sendVerificationEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailerConfig.GOOGLE_EMAIL,
        pass: mailerConfig.GOOGLE_EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `메일 인증 <${mailerConfig.GOOGLE_EMAIL}>`,
      to: email,
      subject: "가입 인증 메일",
      html: `인증 코드: ${token}`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error); // 개발 중에만 포함
    throw new EmailSendingError("메일 전송 실패.");
  }
}

module.exports = {
  sendVerificationEmail,
};
