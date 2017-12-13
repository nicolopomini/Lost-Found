'use strict';

//requiring supertest to test app
const request = require('supertest');
//requiring app to test
const app = require('../app.js');
//requiring Issue schema
const Issue = require('../models/issue.js');

var tmp;

const without_token = {
  description: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover"
};

const with_token = {
  token: '5a280a822724c45be22aeedb',
  description: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover"
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
      console.log(res.body.issue);
      tmp=res.body.issue;
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
      console.log(res.body.issue);
    });
});


//------ TEST API ricerca oggetto ------

test('Chiamata GET alle API per cercare un oggetto. Con issueid giusto e con token, dovrebbe restituire l\'issue', () => {
  return request(app)
    .get('/issues/'+tmp+'?token=5a280a822724c45be22aeedb')
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.error).toBe(false);
      console.log(res.body.issues);
    });
});
