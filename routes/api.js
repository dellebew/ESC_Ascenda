var express = require('express');
var router = express.Router();
var url = require('url');
var request = require('request');

const baseUrl = 'https://hotelapi.loyalty.dev/api/hotels/'
const id = 'diH7'
router.get('/', function(req, res, next) {
  request({
    uri: url.resolve(baseUrl,id)
  }).pipe(res);
});

module.exports = router;