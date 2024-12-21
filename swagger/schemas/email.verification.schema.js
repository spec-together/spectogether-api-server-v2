const EmailVerificationSchema = {
  CheckEmailUniqueRequest: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "중복 확인할 이메일",
      },
    },
    required: ["email"],
  },

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
  VerifyEmailRequest: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "인증할 이메일",
      },
      code: {
        type: "string",
        description: "이메일로 받은 인증 코드",
      },
    },
    required: ["email", "code"],
  },

  SendVerificationEmailResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "인증 이메일이 발송되었습니다.",
      },
    },
  },
  VerifyEmailResponse: {
    type: "object",
    properties: {
      email_verification_id: {
        type: "string",
        description: "암호화된 이메일 인증 코드 ID",
      },
      message: {
        type: "string",
        example: "이메일 인증이 완료되었습니다.",
      },
    },
  },
};

module.exports = EmailVerificationSchema;
