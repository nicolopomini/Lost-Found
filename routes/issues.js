var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

var matching = require('../models/issue.matching');


//Matching the given issue with all the other issues
router.get('/:issueid', function(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  var id = req.params.issueid;
  if(!id) {
    handleError(res, "Issue id required");
    return;
  }
  Issue.findById(id, (err, issue) => {
    if(err) {
      hadleError(res, "Required issue does not exist.");
      return;
    }
    var limit = new Date(); //today
    limit.setDate(limit.getDate() - 30); //today - 30 days
    var opposit_type = issue.type == 'searching' ? 'found' : 'searching';
    Issue.find({
      type: opposit_type,
      inserted: {$gt: limit}
    }, (err, issues) => {
      //issues: array di issue del db
      //issue: singola issue da matchare
      if(err) {
        hadleError(res, "Error during retriving issues into mongo");
        return;
      }
      var rtr = {};
      rtr.error = "false";
      rtr.issues = matching.match(issue,issues,1);
      res.json(rtr);
    });
  });
});


//handling errors in API functions
function hadleError(res, error) {
  var toSend = {};
  toSend.error = error;
  toSend.issue = null;
  res.json(toSend);
}

module.exports = router;
