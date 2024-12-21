// node presets/database/seed-inquiry.js

const { Inquiry, InquiryAnswer, User, sequelize } = require("../../../models");

// 샘플 데이터를 생성하기 위한 유틸리티 함수
// const { faker } = require("@faker-js/faker"); // @faker-js/faker 라이브러리를 사용하여 랜덤 데이터 생성
const faker = require("@faker-js/faker").faker; // CJS 환경에서는 이렇게 사용해야 한다고 한다.

const seed = async () => {
  try {
    // 데이터베이스에 연결
    await sequelize.authenticate();
    console.log("데이터베이스에 성공적으로 연결되었습니다.");

    // 모델 초기화
    // User.init(sequelize);
    // Inquiry.init(sequelize);
    // InquiryAnswer.init(sequelize);

    // 모델 간의 연관 관계 설정
    // Inquiry.associate({ InquiryAnswer });
    // InquiryAnswer.associate({ Inquiry });

    // 테이블 동기화 (이미 테이블이 존재하면 변경하지 않음)
    await sequelize.sync();
    console.log("모델과 데이터베이스 동기화 완료.");

    // 기존 데이터 삭제 (필요한 경우 주석 해제)
    // await Inquiry.destroy({ where: {} });
    // await InquiryAnswer.destroy({ where: {} });

    // 22개의 샘플 문의 데이터 생성
    const inquiries = [];
    for (let i = 1; i <= 22; i++) {
      inquiries.push({
        // user_id: faker.datatype.number({ min: 1, max: 10 }), // 사용자 ID (예시: 1~10)
        user_id: faker.helpers.rangeToNumber({ min: 1, max: 10 }), // 5.0.0 버전 이후 사용법
        title: `샘플 문의 제목 ${i}`,
        content: `이것은 샘플 문의 내용 ${i}입니다.`,
        image_url: faker.image.urlLoremFlickr({ category: "business" }), // 랜덤 이미지 URL
        read_at: faker.date.past(), // 과거 날짜
        answered_at: faker.datatype.boolean() ? faker.date.past() : null, // 임의로 답변 여부 결정
        status: faker.helpers.arrayElement(["pending", "answered", "closed"]), // 상태
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      });
    }

    // 문의 데이터 삽입
    const createdInquiries = await Inquiry.bulkCreate(inquiries);
    console.log("22개의 문의 데이터가 성공적으로 삽입되었습니다.");

    // 12개의 샘플 답변 데이터 생성
    const inquiryAnswers = [];
    for (let i = 1; i <= 12; i++) {
      // 답변을 삽입할 문의 선택 (랜덤하게 선택)
      const randomInquiry =
        createdInquiries[Math.floor(Math.random() * createdInquiries.length)];

      inquiryAnswers.push({
        inquiry_id: randomInquiry.inquiry_id,
        // admin_id: faker.datatype.number({ min: 1, max: 5 }), // 관리자 ID (예시: 1~5)
        admin_id: 0, // 추후 Admin 모델을 별도로 구현할 때 이 부분을 수정해야 합니다.
        title: `샘플 답변 제목 ${i}`,
        content: `이것은 샘플 답변 내용 ${i}입니다.`,
        image_url: faker.image.urlLoremFlickr({ category: "business" }), // 랜덤 이미지 URL
        created_at: faker.date.recent(),
        updated_at: faker.date.recent(),
      });
    }

    // 답변 데이터 삽입
    await InquiryAnswer.bulkCreate(inquiryAnswers);
    console.log("12개의 답변 데이터가 성공적으로 삽입되었습니다.");
  } catch (error) {
    console.error("샘플 데이터 삽입 중 오류가 발생했습니다:", error);
  } finally {
    // 데이터베이스 연결 종료
    await sequelize.close();
    console.log("데이터베이스 연결이 종료되었습니다.");
  }
};

// 시드 실행
seed();
