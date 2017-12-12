const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Tag = require('./issue.tag');
const config = require('../config/config.js');

var IssueSchema = new Schema({
  //document property: SchemaType
  time: {type: Date, default: null}, //when did I find it?
  inserted: {type: Date, default: Date.now(), required: true}, //when di I inserted this issue?
  room: {type: String, default: ''}, //where did i found it?
  description: {type: String, required: true}, //what
  author: {type: mongoose.Schema.Types.ObjectId,  ref: 'User', required: true}, //who
  photo: {type: String, default: null},
  tags: [{
    original: {type: String, minlength: 1}, //original string retrieved from IBM Watson
    parsed: {type: String, minlength: 1}, //original, but lower-case without spaces
    relevance: {type: Number, min: 0, max: 1} //relevance is a double between 0 and 1
  }],
  type: {type: String, enum: ['searching','found'], required: true} //searching or found?
});

//using IBM watson to evaluate the sentence
IssueSchema.methods.watson = function(next) {
  var self = this;

  //NLP used only here
  var NaturalLanguageProcessor = require('watson-developer-cloud/natural-language-understanding/v1.js');

  //setting up the connection to Watson API
  var nlp = new NaturalLanguageProcessor(config.get('WATSON_OPTIONS'));

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
