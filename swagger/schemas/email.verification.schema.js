const EmailVerificationSchema = {
  CheckEmailUnique: {
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

  SendVerification: {
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

  VerifyEmail: {
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
};

module.exports = EmailVerificationSchema;
