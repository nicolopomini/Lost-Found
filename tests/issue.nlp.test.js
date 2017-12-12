var Issue = require('../models/issue');

var issue = new Issue({
  description: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover.",
  time: null,
  inserted: Date.now(),
  author: null,
  photo: null,
  tags: [],
  type: 'search'
});

test("The issue's description is sent to the Watson's NLP API, which must return error != true (the request has been correctly elaborated)", () => {
  function callback(err, response) {
    console.log('error:', err);
    console.log('response:', JSON.stringify(response, null, 2));

    expect(err).toBe(false);
  }

  issue.watson(callback);
});
