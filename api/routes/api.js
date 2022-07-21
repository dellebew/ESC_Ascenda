var express = require('express');
var router = express.Router();

// Require controllers
var hotelController = require("../controllers/hotelController");
var destinationController = require("../controllers/destinationController");
var hotelPriceController = require("../controllers/hotelPriceController");
var destinationPricesController = require("../controllers/destinationPricesController");
// var paymentController = require("../stripe/server")
//var successfulPayments = require("../controllers/successfulPaymentController");

// static details for a given hotel
router.get('/hotel/:id', hotelController.getOneHotel);

// hotels belonging to a particular destination
router.get('/destination/hotels/:id/:page', destinationController.getDestinationHotelIds);

// price for a given hotel (with filtering conditions)
router.get('/hotel/price/:id', hotelPriceController.getHotelPrice);

// hotel prices for a given destination (with filtering conditions)
router.get('/destination/prices/:id/:page', destinationPricesController.getDestinationHotelPrices);

// Payment Services
// router.get('/stripe/', paymentController);
module.exports = router;