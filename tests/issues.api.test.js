'use strict';

//requiring supertest to test app
const request = require('supertest');
//requiring app to test
const app = require('../app.js');
//requiring Issue schema
const Issue = require('../models/issue.js');

const without_token = {
  descrizione: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover"
};

const with_token = {
  token: '5a280a822724c45be22aeedb',
  descrizione: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover"
};

const issue_without_token = {
  issueid: ""//TODO
};

const wrong_issue_without_token = {
  issueid: ""//TODO
};

const issue_with_token = {
  token: '5a280a822724c45be22aeedb',
  issueid: ""//TODO
};

//------ TEST API segnalare un oggetto smarrito ------

test('chiamata POST alle API per segnalare un oggetto smarrito. Senza parametri, dovrebbe dare errore', () => {
  return request(app)
    //request through POST method
    .post('/issues/search')
    //expecting results
    .then((res) => {
      //console.log('Result\'s body');
      //console.log(res.body);
    });
});

test('chiamata POST alle API per segnalare un oggetto smarrito. Con paramentri ma senza token, dovrebbe dare errore', () => {
  return request(app)
    .post('/issues/search')
    .send(without_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('chiamata POST alle API per segnalare un oggetto smarrito. Con parametri e token, dovrebbe restituire l\'id', () => {
  return request(app)
    .post('/issues/search')
    .send(with_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe(false);
      console.log('ISSUE risultato: ');
      console.log(res.body.issue);
      expect(res.body.issue).toBe('5a280a822724c45be22aeedb');
    });
});

//------ TEST API segnalare un oggetto trovato ------

test('chiamata POST alle API per segnalare un oggetto trovato. Senza parametri, dovrebbe dare errore', () => {
  //testing API, the promise way
  return request(app)
    //request through POST method
    .post('/issues/found')
    //expecting results
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('Chiamata POST alle API per segnalare un oggetto trovato. Con paramentri ma senza token, dovrebbe dare errore', () => {
  return request(app)
    .post('/issues/found')
    .send(without_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('chiamata POST alle API per segnalare un oggetto trovato. Con parametri e token, dovrebbe restituire l\'id', () => {
  return request(app)
    .post('/issues/found')
    .send(with_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe(false);
      expect(res.body.issue).toBe('5a280a822724c45be22aeedb');
    });
});


//------ TEST API ricerca oggetto ------

test('Chiamata GET alle API per cercare un oggetto. Senza issueid e senza token, dovrebbe dare errore', () => {
  //testing API, the promise way
  return request(app)
    //request through POST method
    .get('/issues/')
    //expecting results
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('Chiamata GET alle API per cercare un oggetto. Con issueid sbagliato e senza token, dovrebbe dare errore', () => {
  //testing API, the promise way
  return request(app)
    //request through POST method
    .get('/issues/')
    .send(wrong_issue_without_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('Chiamata GET alle API per cercare un oggetto. Con issueid giusto e senza token, dovrebbe dare errore', () => {
  //testing API, the promise way
  return request(app)
    //request through POST method
    .get('/issues/')
    .send(issue_without_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).not.toBe(false);
      expect(res.body.issue).toBe(null);
    });
});

test('Chiamata GET alle API per cercare un oggetto. Con issueid giusto e con token, dovrebbe restituire l\'issue', () => {
  return request(app)
    .get('/issues/')
    .send(issue_with_token)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe(false);
      //expect(res.body.issue).toBe('5a280a822724c45be22aeedb');
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
