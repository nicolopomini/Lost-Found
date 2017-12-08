'use strict';

//requiring supertest to test app
const request = require('supertest');
//requiring app to test
const app = require('../../app.js');
//requiring Issue schema
const Issue = require('../../models/issue.js');

const without_token = {
  descrizione: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover"
};

const with_token = {
  token: '5a280a822724c45be22aeedb',
  descrizione: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover"
};

/*
var issue1 = new Issue();
issue1.description = "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover.";
issue1.type = "search";
issue1.tags = ["tag1"];
issue1.author = null;
issue1.photo = null;
issue1.inserted = Date.now();
issue1.time = Date.now();
*/

test('POST call to issues API without parameters, expecting errors', () => {
  //testing API, the promise way
  return request(app)
    //request through POST method
    .post('/issues/found')
    //expecting results
    .then((res) => {
      //console.log('Result\'s body');
      //console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('POSTs a correct issue and without a token, expects error', () => {
  return request(app)
    .post('/issues/found')
    .send(without_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('POSTs a correct issue with a valid token', () => {
  //var issue = new Issue(params);
  return request(app)
    .post('/issues/found')
    .send(with_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe(false);
      console.log('ISSUE risultato: ');
      console.log(res.body.issue);
      //expect(res.body.issue).toBe();
    });
});


/*
var http = require("http");
var options = {
  hostname: 'localhost',
  port: 3000,
  path: '/issues/found',
  method: 'POST',
  headers: {
      'token': token,
      'descrizione': 'I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover.'
  }
};
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('{"string": "Hello, World"}');
req.end();


*/
