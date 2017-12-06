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
      rtr.issues = matching.match(issue,issues);
      res.json(rtr);
    });
  });
});

//Inserting an issue of a searched object
router.post('/search', function(req, res) {
  insertIssue(req, res, 'searching');
});

//Inserting an issue of a found object
router.post('/found', function(req, res) {
  insertIssue(req, res, 'found');
});

//takes in the issue request and the issue's type
//elaborates the issue trough watson
//inserts the issue
function insertIssue(req, res, type) {
  //gets params from post
  var params = req.body;
  //assgning the issue's type to the issue's params
  params.type = type;
  //sets the insertion date
  params.inserted = Date.now();
  //creating issue using params
  var issue = new Issue(params);
  issue.description = params.descrizione;
  issue.time = params.data;
  issue.room = params.aula;

  //setting up the response headers
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  //validating created issues
  var valid = (!issue.validateSync());

  //checking if parameters are valid
  if(valid) {
    //calling ibm watson for nlp elaboration
    issue.watson((wErr, wRes) => {
      //no error thrown by watson: parsing tags
      if(wErr == null) {
        //adding tags to issue
        issue.addTags(wRes.keywords);
        issue.sortTags();
        issue.save((err) => {
          if(err) {
            handleError(res, "Error in db inserting.");
          }
        });
          var jRes = {};
          jRes.error = false;
          jRes.issue = issue._id;
          res.json(jRes);
      }
      //watson's error
      else {
        handleError(res, "Error during issue parsing.");
      }
    });
  } else {
      handleError(res, "Issue not valid.");
  }
}

//handling errors in API functions
function hadleError(res, error) {
  var toSend = {};
  toSend.error = error;
  toSend.issue = null;
  res.json(toSend);
}



module.exports = router;
