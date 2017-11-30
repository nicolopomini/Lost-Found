var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

//Inserting an issue of a searched object
router.post('/search', function(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  var description = req.query.descrizione;
  var room = req.query.aula;
  var time = req.query.data;
  var error = false;
  if(!description)
    error = true;
  var issue = new Issue();
  if(error)
    issue = null;
  else {
    issue.description = description;
    issue.room = room;
    issue.time = time;
    issue.type = 'searching';
    issue.watson((err, risp) => {
      if(err == null) 
        issue.addTags(risp.keywords);
      else 
        error = true;
    } );
  }
  var respJSON = {};
  respJSON.error = error;
  if(error)
    respJSON.issue = null;
  else
    respJSON.issue = issue._id;
  res.send(JSON.stringify(respJSON));
});

//Inserting an issue of a found object
router.post('/found', function(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  var description = req.query.descrizione;
  var room = req.query.aula;
  var time = req.query.data;
  var error = false;
  if(!description)
    error = true;
  var issue = new Issue();
  if(error)
    issue = null;
  else {
    issue.description = description;
    issue.room = room;
    issue.time = time;
    issue.type = 'found';
    issue.watson((err, risp) => {
      if(err == null) 
        issue.addTags(risp.keywords);
      else 
        error = true;
    } );
  }
  var respJSON = {};
  respJSON.error = error;
  if(error)
    respJSON.issue = null;
  else
    respJSON.issue = issue._id;
  res.send(JSON.stringify(respJSON));
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
