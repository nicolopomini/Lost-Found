const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.js');
const Tag = require('./tag.js');

var IssueSchema = new Schema({
  //document property: SchemaType
  time: {type: Date, default: null}, //when did I find it?
  inserted: {type: Date, default: Date.now()}, //when di I inserted this issue?
  room: {type: String, default: ''}, //where did i found it?
  description: {type: String, default: ''}, //what
  author: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'}, //who
  photo: {type: String, default: null},
  tags: [{
    original: String, //original string retrieved from IBM Watson
    parsed: String, //original, but lower-case without spaces
    relevance: Number //relevance is a double between 0 and 1
  }],
  source: {
    type: String,
    enum: ['search', 'find']
  } //searching or found?
});

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

//exporting Issue object
module.exports = mongoose.model('Issue', IssueSchema);
