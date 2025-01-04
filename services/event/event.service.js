const db = require("../../models");
const paginator = require("../../utils/paginator");
const CustomError = require("../../errors");
const { encrypt62 } = require("../../utils/encrypt.util");

const getAllEvents = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  // TODO : limit 를 FE에서 정의해주고 있는 것을 BE 내부에서 정의하는 것으로 변경
  try {
    const { rows, count } = await db.Event.findAndCountAll({
      limit,
      offset,
      attributes: [
        "event_id",
        "title",
        "subtitle",
        "poster_image_url",
        "description",
        "host_id",
        "application_url",
        "location",
        "is_online",
        "starts_at",
        "ends_at",
        "application_start_date",
        "application_end_date",
      ],
      order: [["created_at", "DESC"]],
    });
    const events = await Promise.all(
      rows.map(async (ev) => {
        const host = await ev.getHost({ attributes: ["user_id", "nickname"] });
        const orgUser = await host.getOrganization_user({
          attributes: ["organization_id", "user_id"],
        });
        const org = await orgUser.getOrganization({
          attributes: ["name", "organization_id"],
        });

        return {
          event_id: ev.event_id.toString(),
          title: ev.title,
          subtitle: ev.subtitle,
          poster_image_url: ev.poster_image_url,
          description: ev.description,
          host_id: encrypt62(ev.host_id.toString()),
          host_nickname: host.nickname,
          organization_id: org.organization_id,
          organization_name: org.name,
          application_url: ev.application_url,
          location: ev.location,
          starts_at: ev.starts_at,
          ends_at: ev.ends_at,
          is_online: ev.is_online,
          application_start_date: ev.application_start_date,
          application_end_date: ev.application_end_date,
          created_at: ev.created_at,
          updated_at: ev.updated_at,
        };
      })
    );

    const pagination = paginator.createPagination("events", count, page, limit);
    return { events, pagination };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError(
        "이벤트 목록 조회에 실패했습니다.",
        error
      );
    }
    throw error;
  }
};

const getEventByEventId = async ({ eventId }) => {
  try {
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      throw new CustomError.NotExistsError("해당 이벤트가 존재하지 않습니다.");
    }
    const host = await event.getHost({ attributes: ["user_id", "nickname"] });
    const organizationUser = await host.getOrganization_user({
      attributes: ["organization_id", "user_id"],
    }); // organizationUser.organization_id; 기관 ID
    const organization = await organizationUser.getOrganization({
      attributes: ["name", "organization_id"],
    }); // organization.name; 기관 이름
    // hasOne 대신 hasMany로 연결되어있다면
    // const organizationUsers = await host.getOrganization_users();
    // const organizations = await Promise.all(
    //   organizationUsers.map(async (organizationUser) => {
    //     return await organizationUser.getOrganization();
    //   })
    // );
    const eventImages = await event.getEvent_images();

    const flattenedEvent = {
      event_id: event.event_id,
      title: event.title,
      subtitle: event.subtitle,
      poster_image_url: event.poster_image_url,
      description: event.description,
      host_id: encrypt62(event.host_id.toString()),
      host_nickname: host.nickname,
      application_url: event.application_url,
      location: event.location,
      starts_at: event.starts_at,
      ends_at: event.ends_at,
      is_online: event.is_online,
      application_start_date: event.application_start_date,
      application_end_date: event.application_end_date,
      organization_id: organization.organization_id,
      organization_name: organization.name,
      event_images: eventImages.map((img) => ({
        image_id: img.sequence,
        image_url: img.image_url,
      })),
    };

    return { event: flattenedEvent };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("이벤트 조회에 실패했습니다.");
    }
    throw error;
  }
};

const createEvent = async ({
  host_id,
  title,
  subtitle,
  description,
  application_url,
  location,
  is_online,
  starts_at,
  ends_at,
  application_start_date,
  application_end_date,
  poster_image_url,
  eventImageUrls,
}) => {
  try {
    const t = await db.sequelize.transaction();
    const newEvent = await db.Event.create(
      {
        host_id,
        title,
        subtitle,
        description,
        application_url,
        location,
        is_online,
        starts_at,
        ends_at,
        application_start_date,
        application_end_date,
        starts_at,
        ends_at,
        poster_image_url,
      },
      { transaction: t }
    );
    if (eventImageUrls.length > 0) {
      const eventImageRecords = eventImageUrls.map((url, index) => ({
        event_id: newEvent.event_id,
        image_url: url,
        sequence: index + 1,
      }));
      await db.EventImage.bulkCreate(eventImageRecords, { transaction: t });
    }
    await t.commit();
    return { event_id: newEvent.event_id, message: "이벤트 생성 성공" };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      await t.rollback();
      throw new CustomError.DatabaseError("이벤트 생성에 실패했습니다.", error);
    }
    await t.rollback();
    throw error;
  }
};

const updateEvent = async ({
  hostId,
  eventId,
  title,
  subtitle,
  poster_image_url,
  description,
  application_url,
  location,
  starts_at,
  ends_at,
  is_online,
  application_start_date,
  application_end_date,
  eventImageUrls,
}) => {
  try {
    const t = await db.sequelize.transaction();
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      throw new CustomError.NotExistsError("해당 이벤트가 존재하지 않습니다.");
    }
    if (event.host_id !== hostId) {
      throw new CustomError.NotAllowedError("이벤트 수정 권한이 없습니다.");
    }
    await event.update(
      {
        title,
        subtitle,
        poster_image_url,
        description,
        application_url,
        location,
        starts_at,
        ends_at,
        is_online,
        application_start_date,
        application_end_date,
      },
      { transaction: t }
    );
    if (eventImageUrls.length > 0) {
      const existingImages = await db.EventImage.findAll({
        where: { event_id: eventId },
      });
      // 기존 이미지 row 가 있으면 삭제 처리
      if (existingImages.length > 0) {
        await db.EventImage.destroy(
          { where: { event_id: eventId } },
          { transaction: t }
        );
      }
      // 없으면 바로 추가
      const eventImageRecords = eventImageUrls.map((url, index) => ({
        event_id: eventId,
        image_url: url,
        sequence: index + 1,
      }));
      console.log(eventImageRecords);
      await db.EventImage.bulkCreate(eventImageRecords, { transaction: t });
    }
    await t.commit();
    return { event_id: event.event_id, event, message: "이벤트 수정 성공" };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      await t.rollback();
      throw new CustomError.DatabaseError("이벤트 수정에 실패했습니다.", error);
    }
    await t.rollback();
    throw error;
  }
};

const deleteEvent = async ({ hostId, eventId }) => {
  try {
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      throw new CustomError.NotExistsError("해당 이벤트가 존재하지 않습니다.");
    }
    if (event.host_id !== hostId) {
      throw new CustomError.NotAllowedError("이벤트 삭제 권한이 없습니다.");
    }
    await db.EventImage.destroy({ where: { event_id: eventId } });
    await event.destroy();
    return { message: "이벤트 삭제 성공" };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("이벤트 삭제에 실패했습니다.", error);
    }
    throw error;
  }
};

const getEventBasicInfo = async ({ eventId }) => {
  try {
    const event = await db.Event.findByPk(eventId, {
      attributes: [
        "event_id",
        "title",
        "application_url",
        "starts_at",
        "ends_at",
        "application_start_date",
        "application_end_date",
      ],
    });
    if (!event) {
      throw new CustomError.NotExistsError("해당 이벤트가 존재하지 않습니다."); // event is null
    }
    return { event, message: "이벤트 일정 조회 성공" };
  } catch (error) {
    if (error instanceof db.Sequelize.DatabaseError) {
      throw new CustomError.DatabaseError("이벤트 일정 조회 실패");
    }
    throw error;
  }
};

module.exports = {
  getAllEvents,
  getEventByEventId,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventBasicInfo,
};
