var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();

//db-like schema constructors
var User = require('../models/user.js');
var Issue = require('../models/issue.js');

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
      var jRes = {} //json response object
      //no error thrown by watson: parsing tags
      if(wErr == null) {
        //adding tags to issue
        issue.addTags(wRes.keywords);
        issue.sortTags();
        issue.save((err) => {
          if(err) {
            jRes.error = "Error in db inserting.";
            jRes.issue = null;
            res.json(jRes);
          }
        });
          jRes.error = false;
          jRes.issue = issue._id;
      }
      //watson's error
      else {
        jRes.error = "Error during issue parsing.";
        jRes.issue = null;
      }
      //output
      res.json(jRes);
    });
  } else {
    var jRes = {};
    jRes.error = "Issue not valid";
    jRes.issue = null;
    res.json(jRes);
  }
}

module.exports = router;
