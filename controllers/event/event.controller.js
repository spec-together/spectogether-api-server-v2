const eventService = require("../../services/event/event.service");
const logger = require("../../logger");

const getAllEvents = async (req, res, next) => {
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
    const userId = parseInt(req.user.user_id);
    const uploadedPosterImage = req.files.image[0];
    const uploadedEventImages = req.files.images;
    const poster_image_url = uploadedPosterImage
      ? uploadedPosterImage.path
      : "";
    const eventImageUrls = uploadedEventImages
      ? uploadedEventImages.map((file) => file.path)
      : [];
    const {
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
    } = req.body;
    const result = await eventService.createEvent({
      host_id: userId,
      title,
      subtitle,
      description,
      application_url,
      location,
      starts_at,
      ends_at,
      is_online,
      application_start_date,
      application_end_date,
      poster_image_url: poster_image_url,
      eventImageUrls: eventImageUrls,
    });
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
    const uploadedPosterImage = req.files.image[0];
    const uploadedEventImages = req.files.images;
    const poster_image_url = uploadedPosterImage
      ? uploadedPosterImage.path
      : "";
    const eventImageUrls = uploadedEventImages
      ? uploadedEventImages.map((file) => file.path)
      : [];
    const {
      title,
      subtitle,
      // poster_image_url,
      description,
      application_url,
      location,
      is_online,
      starts_at,
      ends_at,
      application_start_date,
      application_end_date,
    } = req.body;
    const result = await eventService.updateEvent({
      hostId: userId,
      eventId,
      title,
      subtitle,
      description,
      application_url,
      location,
      starts_at,
      ends_at,
      is_online,
      application_start_date,
      application_end_date,
      poster_image_url,
      eventImageUrls,
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

const getEventBasicInfo = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const result = await eventService.getEventBasicInfo({ eventId });
    return res
      .status(200)
      .success({ event: result.event, message: result.message });
  } catch (error) {
    logger.error(`[getEventTodos] Error: ${error.stack}`);
    next(error);
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
