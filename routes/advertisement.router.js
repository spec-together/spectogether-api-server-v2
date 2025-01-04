const express = require("express");
const carouselController = require("../controllers/advertisement/carousel.ad.controller");
const router = express.Router();

router.get("/carousel", carouselController.getCarouselAds);

module.exports = router;
