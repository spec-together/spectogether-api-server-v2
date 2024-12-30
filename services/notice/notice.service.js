const db = require("../../models");
const CustomError = require("../../errors");

const getAllNotices = async ({}) => {
  try {
    const notices = await db.Notice.findAll({
      attributes: [
        "notice_id",
        "author_id",
        "title",
        "content",
        "created_at",
        // "updated_at",
      ],
      order: [["created_at", "DESC"]],
      include: [
        { model: db.User, as: "author", attributes: ["user_id", "nickname"] },
      ],
    });
    // TODO : pagination 추가하면서 findAndCountAll로 변경하자
    const flattenedNotices = notices.map((ntc) => ({
      notice_id: ntc.notice_id,
      author_id: ntc.author_id,
      author_nickname: ntc.author.nickname,
      title: ntc.title,
      content: ntc.content,
      created_at: ntc.created_at,
    }));
    return { notices: flattenedNotices };
  } catch (error) {
    throw new CustomError.DatabaseError("공지 목록 조회 실패");
  }
};

const getNoticeByNoticeId = async ({ noticeId }) => {
  try {
    const notice = await db.Notice.findByPk(noticeId, {
      attributes: ["notice_id", "author_id", "title", "content", "created_at"],
      include: [
        {
          model: db.NoticeImage,
          as: "notice_images",
          attributes: ["sequence", "image_url"],
          separate: true,
          order: [["sequence", "ASC"]],
          // required: true 하면 INNER JOIN으로
        },
        { model: db.User, as: "author", attributes: ["user_id", "nickname"] },
      ],
    });
    if (!notice) {
      throw new CustomError.NotExistsError("해당 공지가 존재하지 않습니다.");
    }
    const flattenedNotice = {
      notice_id: notice.notice_id,
      author_id: notice.author_id,
      author_nickname: notice.author.nickname,
      title: notice.title,
      content: notice.content,
      created_at: notice.created_at,
      notice_images: notice.notice_images.map((img) => ({
        sequence: img.sequence,
        image_url: img.image_url,
      })),
    };
    return { notice: flattenedNotice };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("공지 조회 실패");
    }
    throw error;
  }
};

const createNotice = async ({ authorId, title, content, noticeImages }) => {
  try {
    // console.log("Creating notice with:", {authorId,title,content,noticeImages});
    const newNotice = await db.Notice.create({
      author_id: authorId,
      title: title,
      content: content,
    });
    // console.log("Notice created:", newNotice);
    if (noticeImages) {
      const noticeImageRecords = noticeImages.map((img, index) => ({
        notice_id: newNotice.notice_id,
        image_url: img.image_url,
        sequence: index + 1,
      }));
      // console.log("Creating notice images with:", noticeImageRecords);
      await db.NoticeImage.bulkCreate(noticeImageRecords);
    }
    return { notice: newNotice };
  } catch (error) {
    // console.error("Error creating notice:", error);
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("공지 생성 실패");
    }
    throw error;
  }
};

const updateNotice = async ({
  authorId,
  noticeId,
  title,
  content,
  noticeImages,
}) => {
  try {
    const notice = await db.Notice.findByPk(noticeId);
    if (!notice) {
      throw new CustomError.NotExistsError("해당 공지가 존재하지 않습니다.");
    }
    // 작성자 확인 로직
    if (notice.author_id !== authorId) {
      throw new CustomError.NotAllowedError(
        "해당 공지를 수정할 권한이 없습니다."
      );
    }
    await notice.update({ title, content });
    console.log("noticeImages:", noticeImages);
    if (noticeImages) {
      // 기존 이미지 row 삭제 // TODO : 기존 이미지 제거 여부 확인하는 로직 추가 (현재는 무조건 삭제)
      await db.NoticeImage.destroy({ where: { notice_id: noticeId } });
      // 새로운 이미지 row 추가
      const noticeImageRecords = noticeImages.map((image, index) => ({
        notice_id: noticeId,
        image_url: image.image_url,
        sequence: index + 1,
      }));
      await db.NoticeImage.bulkCreate(noticeImageRecords);
    }

    return { notice, message: "공지 업데이트 성공" };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("공지 업데이트 실패");
    }
    throw error;
  }
};

const deleteNotice = async ({ authorId, noticeId }) => {
  try {
    const notice = await db.Notice.findByPk(noticeId);
    if (!notice) {
      throw new CustomError.NotExistsError("해당 공지가 존재하지 않습니다.");
    }
    if (notice.author_id !== authorId) {
      throw new CustomError.NotAllowedError(
        "해당 공지를 삭제할 권한이 없습니다."
      );
    }
    const noticeImages = await db.NoticeImage.findAll({
      where: { notice_id: noticeId },
    });
    noticeImages.forEach(async (nImage) => {
      await nImage.destroy();
    });
    await notice.destroy(); // TODO : deleted_at 필드 추가하고 destroy 대신 update로 변경하기
    return { message: "공지 삭제 성공" };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("공지 삭제 실패 db");
    }
    throw error;
  }
};

module.exports = {
  getAllNotices,
  getNoticeByNoticeId,
  createNotice,
  updateNotice,
  deleteNotice,
};
