const { NotExistsError } = require("../../errors");
const { CarouselAd } = require("../../models");

const getCarouselAds = async () => {
  const ads = await CarouselAd.findAll({
    attributes: ["link"],
    where: {
      is_active: true,
    },
  });

  if (!ads) {
    throw new NotExistsError("등록된 광고가 없습니다.");
  }

  return ads;
};

module.exports = {
  getCarouselAds,
};
