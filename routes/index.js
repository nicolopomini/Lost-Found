var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var _token = req.user ? req.user.id : null;
  res.render('index', {
    token: _token
  });
});

module.exports = router;
