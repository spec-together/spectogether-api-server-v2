const carouselService = require("../../services/advertisement/carousel.ad.service");
const { logError } = require("../../utils/handlers/error.logger");

const getCarouselAds = async (req, res, next) => {
  try {
    const ads = await carouselService.getCarouselAds();

    res.status(200).success({
      ads,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

module.exports = {
  getCarouselAds,
};
