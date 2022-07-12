// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
  res.send("test");
  res.end();
});

module.exports = router;