var express = require('express');
var router = express.Router();

// Require controllers
var hotelController = require("../controllers/hotelController");
var destinationController = require("../controllers/destinationController");
var hotelPriceController = require("../controllers/hotelPriceController");
var destinationPricesController = require("../controllers/destinationPricesController");

// static details for a given hotel
router.get('/hotel/:id', hotelController.getOneHotel);

// hotels belonging to a particular destination
router.get('/destination/hotels/:id/:page', destinationController.getDestinationHotelIds);

// price for a given hotel (with filtering conditions)
// router.get('/hotel/price/:id', hotelPriceController.getHotelPrice);
router.get('/hotel/price/:hotelid/:destinationid/:checkin/:checkout/:lang/:currency/:countrycode2/:guestnumber', hotelPriceController.getHotelPrice);
// e.g. http://localhost:8080/api/hotel/price/diH7/WD0M/2022-07-25/2022-07-29/en_US/SGD/SG/2

// hotel prices for a given destination (with filtering conditions)
// router.get('/destination/prices/:id/:page', destinationPricesController.getDestinationHotelPrices);
router.get('/destination/prices/:destinationid/:checkin/:checkout/:lang/:currency/:countrycode2/:guestnumber/:page', destinationPricesController.getDestinationHotelPrices);
// e.g. http://localhost:8080/api/destination/prices/WD0M/2022-08-27/2022-08-31/en_US/SGD/SG/2/1
        http://localhost:8080/api/destination/prices/FkG9/2022-07-25/2022-07-26/en_US/SGD/ES/2/0

module.exports = router;