'use strict';

//requiring supertest to test app
const request = require('supertest');
//requiring app to test
const app = require('../../app.js');
//requiring Issue schema
const Issue = require('../../models/issue.js');

const params = {
  description: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover.",
  time: null,
  inserted: Date.now(),
  author: null,
  photo: null,
  tags: [],
  type: 'search'
};

//debug
//console.log(issue);

test('POST call to issues API without parameters, expecting errors', () => {
  //testing API, the promise way
  return request(app)
    //request through POST method
    .post('/issues/found')
    //expecting results
    .then((res) => {
      console.log('Result\'s body');
      console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('POSTs a correct issue and without a token, expects error', () => {
  return request(app)
    .post('/issues/found')
    .send(issue)
    .then((res) => {
      console.log('Result\'s body');
      console.log(res.body);
    });
});

test('POSTs a correct issue with a valid token', () => {
  var issue = new Issue(params);
  issue.token = ''; //TODO: inserire token
  return request(app)
    .post('/issues/found')
    .send(issue)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe(false);
      //expect(res.body.issue).toBe();
    });
});
