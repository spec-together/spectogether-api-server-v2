const eventService = require("../../services/event/event.service");
const logger = require("../../logger");

const getAllevents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await eventService.getAllEvents({ page, limit });
    return res.status(200).success({
      events: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error(`[getAllevents] Error: ${error.stack}`);
    next(error);
  }
};

const getEventByEventId = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const result = await eventService.getEventByEventId({ eventId });
    return res.status(200).success({ event: result.event });
  } catch (error) {
    logger.error(`[getEventById] Error: ${error.stack}`);
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    logger.debug(`[createEvent] Request body: ${JSON.stringify(req.body)}`);
    const userId = parseInt(req.user.user_id);
    // const eventData = req.body;
    const {
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
    } = req.body;
    const eventImages = req.files.map((file) => ({ image_url: file.path }));
    const result = await eventService.createEvent({
      hostId: userId,
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
      eventImages,
    });
    // const newEvent = await eventService.createEvent({
    //   eventData,
    //   // evnetImagesData,
    //   userId,
    // });
    return res.status(201).success({ event_id: result.event_id });
  } catch (error) {
    logger.error(`[createEvent] Error: ${error.stack}`);
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    logger.debug(`[updateEvent] Request body: ${JSON.stringify(req.body)}`);
    const userId = parseInt(req.user.user_id);
    const eventId = parseInt(req.params.eventId, 10);
    const {
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
    } = req.body;
    const eventImages = req.files.map((file) => ({ image_url: file.path }));
    console.log(eventImages);
    const result = await eventService.updateEvent({
      hostId: userId,
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
      eventImages,
    });
    return res.status(200).success({
      event_id: result.event_id,
      message: result.message,
    });
  } catch (error) {
    logger.error(`[updateEvent] Error: ${error.stack}`);
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.user_id);
    const eventId = parseInt(req.params.eventId, 10);
    const result = await eventService.deleteEvent({ hostId: userId, eventId });
    return res.status(200).success({ message: result.message });
  } catch (error) {
    logger.error(`[deleteEvent] Error: ${error.stack}`);
    next(error);
  }
};

module.exports = {
  getAllevents,
  getEventByEventId,
  createEvent,
  updateEvent,
  deleteEvent,
};
