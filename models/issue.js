const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Tag = require('./issue.tag');

var IssueSchema = new Schema({
  //document property: SchemaType
  time: {type: Date, default: null}, //when did I find it?
  inserted: {type: Date, default: Date.now()}, //when di I inserted this issue?
  room: {type: String, default: ''}, //where did i found it?
  description: {type: String, minlength: 1}, //what
  author: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'}, //who
  photo: {type: String, default: null},
  tags: [{
    original: {type: String, minlength: 1}, //original string retrieved from IBM Watson
    parsed: {type: String, minlength: 1}, //original, but lower-case without spaces
    relevance: {type: Number, min: 0, max: 1} //relevance is a double between 0 and 1
  }],
  type: {type: String, enum: ['searching','found']} //searching or found?
});

//method used to sort tags internally to an Issue istance
IssueSchema.methods.sortTags = function(t1,t2) {
	return t1.parsed.localeCompare(t2.parsed);
}

//using IBM watson to evaluate the sentence
IssueSchema.methods.watson = function(next) {
  var self = this;

  //NLP used only here
  var NaturalLanguageProcessor = require('watson-developer-cloud/natural-language-understanding/v1.js');

  //setting up the connection to Watson API
  var nlp = new NaturalLanguageProcessor({
    'username': '080d9d59-c184-4cde-8361-8a9deb04e2a1',
    'password': 'b0JW03HO1qYW',
    'version_date': '2017-02-27'
  });

  //defining object params
  var params = {
    'text': self.description,
    'features': {
      'keywords': {
        'sentiment': false,
        'emotion': false,
        'limit': 50
      }
    }
  }

  /*
  //DEBUG
  console.log('Parameters to be sent:')
  console.log(params);
  */

  //executing analisys through Watson Natural Language Processor
  nlp.analyze(params, next);
}

//add tags to this issue object
IssueSchema.methods.addTags = function(keywords) {
  this.tags = []; //empty array
  keywords.forEach((keyword, i) => {
    this.tags[i] = Tag.parseTag(keyword);
  });
}

//sorting tags by parsed text
IssueSchema.methods.sortTags = function() {
  this.tags.sort(Tag.sortTagByParsed);
}

//searching for issues wich are suitable for matching
//resurns a promise (?)
IssueSchema.query.searchSuitable = function() {
  //using 'self' to bind the scope of 'this' inside the query
  var self = this;

  //returning the issues if:
  //max 30 days delay from today
  var limit = new Date(); //today
  limit.setDate(limit.getDate() - 30); //today - 30 days
  return this.find({
    inserted: {$gt: limit}
  }).sort({
    inserted: 'desc'
  });
}

//exporting Issue object
module.exports = mongoose.model('Issue', IssueSchema);
