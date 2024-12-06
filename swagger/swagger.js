const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const authSchema = require("./schemas/auth.schema");
const responseSchema = require("./schemas/response.schema");

// Swagger 옵션 설정
const options = {
  swaggerDefinition: {
    openapi: "3.1.0", // OpenAPI 버전을 3.1.0으로 업데이트
    info: {
      title: "sepctogether API", // 문서 제목
      version: "1.0.0", // 문서 버전
      description: "spectogether API 명세서 입니다", // 문서 설명
    },
    servers: [
      {
        url: "http://localhost:9999", // API 서버 URL
        description: "Local Server",
      },
      {
        url: "https://maybe.aws", // API 서버 URL
        description: "AWS Server",
      },
    ],
    components: {
      securitySchemes: {
        AccessToken_Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Bearer JWT를 활용한 AT 인증입니다.",
        },
        RefreshToken_Cookie: {
          type: "apiKey",
          in: "cookie",
          name: "SPECTOGETHER_RT",
          description: "Secure & HTTP-Only Cookie를 활용한 RT 인증입니다.",
        },
      },
      schemas: {
        ...authSchema,
        ...responseSchema,
      },
    },
    security: [
      {
        AccessToken_Bearer: [],
        RefreshToken_Cookie: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // API 경로 (Swagger 주석이 포함된 파일)
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
