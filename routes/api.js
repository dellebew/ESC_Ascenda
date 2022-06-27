const { application } = require('express');
var express = require('express');
var router = express.Router();



// Require controllers
var apiController = require("../controllers/apiController");
var dbController = require("../controllers/dbController");

// static details for a given hotel
router.get('/hotel/:id', apiController.getOneHotel);
router.get('/db/hotel/:id', dbController.addOneHotel);

// hotels belonging to a particular destination
router.get('/hotels?destination_id/:id', apiController.getDestinationHotels);
router.get('/db/hotels_destinationid/:id', dbController.addDestinationHotelIds);


// price for a given hotel

// hotel prices for a given destination




module.exports = router;