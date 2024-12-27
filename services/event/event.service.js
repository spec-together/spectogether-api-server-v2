const db = require("../../models");
const paginator = require("../../utils/paginator");
const CustomError = require("../../errors");

const getAllEvents = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  try {
    const { rows, count } = await db.Event.findAndCountAll({
      limit,
      offset,
      // attributes: [],
      // include: [],
      order: [["created_at", "DESC"]],
    });
    const pagination = paginator.createPagination(count, page, limit);
    return { events: rows, pagination };
  } catch (error) {
    throw error;
  }
};

const getEventById = async ({ id }) => {
  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      throw new CustomError.NotExistsError("해당 이벤트가 존재하지 않습니다.");
    }
    return { event };
  } catch (error) {
    throw new CustomError.DatabaseError("이벤트 조회에 실패했습니다.");
  }
};

const createEvent = async (eventData) => {
  try {
    const {
      title,
      subtitle,
      poster_image_url,
      description,
      // host_id,
      application_url,
      location,
      is_online,
      application_start_date,
      application_end_date,
      starts_at,
      ends_at,
    } = eventData;
    const newEvent = await db.Event.create({
      title,
      subtitle,
      poster_image_url,
      description,
      host_id: userId,
      application_url,
      location,
      is_online,
      application_start_date,
      application_end_date,
      starts_at,
      ends_at,
    });
    return { newEvent };
  } catch (error) {
    throw new CustomError.DatabaseError("이벤트 생성에 실패했습니다.", error);
  }
};

module.exports = { getAllEvents, getEventById, createEvent };
