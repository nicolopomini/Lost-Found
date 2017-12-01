var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

var matching = require('../models/issue.matching');

//SEARCHING FOR AN ITEM (USING DESCRIPTION)
//search for matching issue by tag comparison
router.get('/', function(req, res) {
  //DEBUG
  console.log('Search by DESCRIPTION');

  //new issue from get parameters
  var issue = new Issue();
  issue.description = 'Prova';
  issue.type = 'found';
  issue.tags = [{original: 'AAAA', parsed: 'a ', relevance : 0.1}];
  var error = issue.validateSync();
  //TODO issue type = 'search'
  console.log('New issue:');
  console.log(issue);
  console.log(error);

  //DEBUG
  res.send('OK');
});

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
    if(err)
      hadleError(res, "Required issue does not exist.");
    var limit = new Date(); //today
    limit.setDate(limit.getDate() - 30); //today - 30 days
    var opposit_type = issue.type == 'searching' ? 'found' : 'searching';
    console.log(limit);
    console.log(opposit_type);
    Issue.find({
      type: opposit_type,
      inserted: {$gt: limit}
    }, (err, issues) => {
      if(err)
        hadleError(res, "Error during retriving issues into mongo");
      var rtr = {};
      rtr.error = "false";
      rtr.issues = matching.match(issue,issues,1);
      res.send(JSON.stringify(rtr));
    });
  });
});

//FOUND ITEM
//new issue from post parameters
router.post('/', function(req, res) {
  //DEBUG
  console.log('Inserting FOUND');

  //creating an Issue istance from POST parameters
  var issue = new Issue(req.body);
  //TODO issue type = 'found'
  console.log('New issue:');
  console.log(issue);

  handleIssue(issue);
});

//handling errors in API functions
function hadleError(res, error) {
  var toSend = {};
  toSend.error = error;
  toSend.issue = null;
  res.send(JSON.stringify(toSend));
}
//handling issue search
function handleIssue(issue) {
  //issue attributes are not valid => no response
  if(!issue.validAttr()) return;

  //generating tags inside the issue class
  issue.generateTags();

  //saving the issue into the db
  issue.save(function(err) {
    //handling db errors
    if (err) return handleError(err);
    //saved!
    console.log('Saved:');
    console.log(issue);
  }).then(function(){ //then() is used to assure that the new issue has been inserted
    //searching for matching TagSchema
    //search for issues with matching tags
    Issue.find({}, function(err, res) {
      //handling db errors
      if(err) handleError(err);
      //works!
      console.log('Searching:');
      console.log(res);
    });
  });
}

module.exports = router;
