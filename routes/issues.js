var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var Tag = require('../models/tag.js');
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

router.get('/', function(req, res){
  /*
  //DEBUG
  var query = req.query;
  res.send(query);
  */

  /*
  //DEBUG
  var issue = new Issue();
  issue.save();
  */

  /*
  //DEBUG DB
  Issue.find({}, function(err, issues) {
    if(err) handleError(err);
    else res.send(issues);

    console.log('OK');
  });
  */
});

router.post('/', function(req, res){
  /*
  //DEBUG
  var body = req.body;
  res.send(body);
  */
});

module.exports = router;
