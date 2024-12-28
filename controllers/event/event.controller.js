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

const getEventById = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await eventService.getEventById({ id: eventId });
    return res.status(200).success({ event });
  } catch (error) {
    logger.error(`[getEventById] Error: ${error.stack}`);
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    logger.debug(`[createEvent] Request body: ${JSON.stringify(req.body)}`);
    const eventData = req.body;
    // const eventPosterImage = req.file.
    // const evnetImagesData = req.file.;
    const userId = req.user.user_id;
    const newEvent = await eventService.createEvent({
      eventData,
      // evnetImagesData,
      userId,
    });
    return res.status(201).success({ event_id: newEvent.event_id });
  } catch (error) {
    logger.error(`[createEvent] Error: ${error.stack}`);
    next(error);
  }
};

module.exports = { getAllevents, getEventById, createEvent };
