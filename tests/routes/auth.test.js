'use strict';

//requiring supertest to test app
const request = require('supertest');
//requiring app to test
const app = require('../app.js');

//testing issues API response
test('Testing issues API response', () => {
  //testing API, the promise way
  return request(app)
    .post('/issues/found')
    .then((res) => {
      console.log(res);
      expect(res.statusCode).toBe(200);
    });
});
