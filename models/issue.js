var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

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
  type: String //searching or found?
});

//validating issue parameters
IssueSchema.methods.checkInput = function() {}

//adding tag elaboration API
//using .methods given by schema
IssueSchema.methods.generateTags = function() {}

//exporting Issue object
module.exports = mongoose.model('Issue', IssueSchema);
