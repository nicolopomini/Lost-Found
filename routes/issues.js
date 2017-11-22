var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var Tag = require('../models/tag.js');
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

//SEARCHING FOR AN ITEM (USING DESCRIPTION)
//search for matching issue by tag comparison
router.get('/', function(req, res) {
  //DEBUG
  console.log('Search by DESCRIPTION');

  //new issue from get parameters
  var issue = new Issue(req.query);
  //TODO issue type = 'search'
  console.log('New issue:');
  console.log(issue);

  //DEBUG
  res.send('OK');
});

//SEARCHING FOR AN ITEM (USING ID)
router.get('/:id', function(req, res) {
  var id = req.params.id;

  /*
  //DEBUG
  var debug = 'Search by ID (= ' + id + ')';
  console.log(debug);
  res.send(debug);
  */

  //searching for a specific item
  Issue.find({}, function(err, issues) {
    //handling db errors
    if(err) handleError(err);
    //works!
    console.log('Found:');
    console.log(issues);
    res.send(issues);
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
