var jest = require('jest'); //requiring jest for test
var Issue = require('../models/issue.js');
var Tag = require('../models/tag.js');

//new issue to be tested
var issue = new Issue({
  description: "I lost my laptop in room B106 yesterday. It is an HP computer, is grey and has a blue cover.",
  time: null,
  inserted: Date.now(),
  author: null,
  photo: null,
  tags: [], //example of tags retrieved from nlp
  type: 'search'
});

//response example
const response = {
  "usage": {
    "text_units": 1,
    "text_characters": 92,
    "features": 1
  },
  "language": "en",
  "keywords": [
    {
      "text": "blue cover",
      "relevance": 0.976246
    },
    {
      "text": "laptop",
      "relevance": 0.82794
    },
    {
      "text": "HP",
      "relevance": 0.77429
    },
    {
      "text": "room",
      "relevance": 0.585064
    }
  ]
};

//keywords array
const keywords = response.keywords;

/*
test("Adding tags from response.keywords to issue.tags, expecting same length, same tag attributes", () => {
  issue.addTags(response.keywords);
  expect(Array.isArray(issue.tags)).toBe(true); //expecting array
  expect(issue.tags.length).toBe(response.keywords.length); //expecting same length

  issue.forEach((elem, index) => {
    expect(elem.text).toBe();
  });
});
*/

test("Testing the keyword's text parsing function: in has to return a string which is lower case and has no white spaces.", () => {
  expect(Tag.parseTagText("blue")).toBe("blue");
  expect(Tag.parseTagText("BLUE")).toBe("blue");
  expect(Tag.parseTagText("blue cover")).toBe("bluecover");
  expect(Tag.parseTagText("Blue Cover")).toBe("bluecover");
});


test("Takes a keyword as input. It must return a tag with original, parsed and relevance attributes. Parsed is a string that can't contain upper cases or white spaces.", () => {
  var tag0 = Tag.parseTag(keywords[0]); //blue cover
  var tag1 = Tag.parseTag(keywords[2]); //HP

  expect(tag0).toEqual({
    original: "blue cover",
    parsed: "bluecover",
    relevance: 0.976246
  });

  expect(tag1).toEqual({
    original: "HP",
    parsed: "hp",
    relevance: 0.77429
  });
});


test("Parsing and then adding keywords as tags into Issue.tags attribute.", () => {
  issue.addTags(keywords); //parsing and adding TagSchema

  //checking 1st tag
  expect(issue.tags[0]).toEqual({
    original: "blue cover",
    parsed: "bluecover",
    relevance: 0.976246
  });

  //checking 2nd tag
  expect(issue.tags[1]).toEqual({
    original: "laptop",
    parsed: "laptop",
    relevance: 0.82794
  });

  //checking 3rd tag
  expect(issue.tags[2]).toEqual({
    original: "HP",
    parsed: "hp",
    relevance: 0.77429
  });

  //checking 4th tag
  expect(issue.tags[3]).toEqual({
    original: "room",
    parsed: "room",
    relevance: 0.585064
  });
});

test("Testing aphabetical sorting of tags on tag.parsed attribute", () => {
  issue.sortTags(); //sorting tags into issue

  expect(issue.tags[0]).toEqual({
    original: "blue cover",
    parsed: "bluecover",
    relevance: 0.976246
  });

  //"hp" must come before "laptop"
  expect(issue.tags[1]).toEqual({
    original: "HP",
    parsed: "hp",
    relevance: 0.77429
  });

  expect(issue.tags[2]).toEqual({
    original: "laptop",
    parsed: "laptop",
    relevance: 0.82794
  });

  expect(issue.tags[3]).toEqual({
    original: "room",
    parsed: "room",
    relevance: 0.585064
  });
});
