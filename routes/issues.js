var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

var matching = require('../models/issue.matching');

//Matching the given issue with all the other issues
//return: issues in json
router.get('/:issueid', function(req, res) {
  handleRequest(req, res, 'match');
});

//Inserting an issue of a searched object
//return: object id
router.post('/search', function(req, res) {
  handleRequest(req, res, 'searching');
});

//Inserting an issue of a found object
//return: object id
router.post('/found', function(req, res) {
  handleRequest(req, res, 'found');
});

//takes in the issue request and the issue's type
//elaborates the issue trough watson
//inserts the issue
function insertIssue(req, res, type, user) {
  var issue = new Issue(req.body);
  /*
  issue.description = req.body.descrizione;
  issue.room = req.body.aula;
  issue.time = req.body.data;
  */
  issue.author = user._id;
  issue.type = type;

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

function matchIssue(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  var id = req.params.issueid;
  if(!id) {
    handleError(res, "Issue id required");
    return;
  }
  Issue.findById(id, (err, issue) => {
    if(err) {
      handleError(res, "Required issue does not exist.");
      return;
    }
    var limit = new Date(); //today
    limit.setDate(limit.getDate() - 30); //today - 30 days
    var opposit_type = issue.type == 'searching' ? 'found' : 'searching';
    Issue.find({
      type: opposit_type,
      inserted: {$gt: limit}
    }).
    populate('author').
    exec ((err, issues) => {
      //issues: array di issue del db
      //issue: singola issue da matchare
      if(err) {
        handleError(res, "Error during retriving issues into mongo");
        return;
      }
      var rtr = {};
      rtr.error = "false";
      rtr.issues = matching.match(issue,issues);
      res.json(rtr);
    });
  });
}

//handling errors in API functions
function handleError(res, error) {
  var toSend = {};
  toSend.error = error;
  toSend.issue = null;
  res.json(toSend);
}
//type: 'match', 'searching', 'found'
function handleRequest(req, res, type) {
  var token = null;
  if(type == 'match') //richiesta get
    token = req.query.token;
  else
    token = req.body.token;
  if(!token) {
    handleError(res, "User token is required");
    return;
  }
  var promise = new Promise((resolve, reject) => {
    User.findById(token, (err,user) => {
      if(err)
        reject(err);
      resolve(user);
    });
  });
  promise.then((val) => { //val = user
    if(type == 'match')
      matchIssue(req, res);
    else if(type == 'searching')
      insertIssue(req, res, 'searching');
    else
      insertIssue(req, res, 'found', val);
  })
  .catch((reason) => {
    handleError(res, "User not valid");
  });
}

module.exports = router;
