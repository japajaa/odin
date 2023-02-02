var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Hello world, this is my BLOG API' });
});

module.exports = router;
