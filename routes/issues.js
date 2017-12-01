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

//takes in the issue request and the issue's type
//elaborates the issue trough watson
//inserts the issue
function insertIssue(req, res, type) {
  //gets params from post
  var params = req.query;
  //assgning the issue's type to the issue's params
  params.type = type;
  //sets the insertion date
  params.inserted = Date.now();
  //creating issue using params
  var issue = new Issue(params);

  /*
  //debug
  console.log('Issue:');
  console.log(issue);
  res.send(issue);
  return;
  */

  //setting up the response headers
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  //validating created issues
  var valid = (!issue.validateSync());

  /*
  //debug
  console.log('valid?');
  console.log(valid);
  return;
  */

  //checking if parameters are valid
  if(valid) {
    //calling ibm watson for nlp elaboration
    issue.watson((wErr, wRes) => {
      /*
      //debug
      console.log('Watson');
      console.log(wErr);
      console.log(JSON.stringify(wRes));
      return;
      */

      var jRes = {} //json response object
      //no error thrown by watson: parsing tags
      if(wErr == null) {
        //adding tags to issue
        issue.addTags(wRes.keywords);

        /*
        //debug
        console.log('Parsed issue');
        console.log(issue);
        return;
        */

        jRes.error = false;
        jRes.issue = issue._id;
      }
      //watson's error
      else {
        jRes.error = true;
        jRes.issue = null;
      }

      /*
      //debug
      console.log('Result');
      console.log(jRes);
      */

      //output
      res.json(jRes);
    });
  }
}

module.exports = router;
