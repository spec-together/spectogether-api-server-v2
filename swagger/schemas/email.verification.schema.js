const EmailVerificationSchema = {
  SendVerificationEmailRequest: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "인증 코드를 받을 이메일",
      },
    },
    required: ["email"],
  },

  SendVerificationEmailResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "암호화된 이메일 인증 코드 ID",
      },
      message: {
        type: "string",
        example: "인증 메일이 발송되었습니다.",
      },
    },
  },

  VerifyEmailRequest: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "암호화된 이메일 인증 코드 ID",
      },
      code: {
        type: "string",
        description: "이메일로 받은 인증 코드",
      },
    },
    required: ["id", "code"],
  },

  VerifyEmailResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "이메일 인증이 완료되었습니다.",
      },
    },
  },
};

module.exports = EmailVerificationSchema;
