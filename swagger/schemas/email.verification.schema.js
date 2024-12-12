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

  SendVerificationResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "인증 이메일이 발송되었습니다.",
      },
    },
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

  // 응답 스키마 추가
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
