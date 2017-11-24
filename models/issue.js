var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

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

//function to sort tags
IssueSchema.methods.sortTags = function(t1,t2) {
	return t1.parsed.localeCompare(t2.parsed);
}

//adding tag elaboration API
//using .methods given by schema
IssueSchema.methods.generateTags = function() {}

//exporting Issue object
module.exports = mongoose.model('Issue', IssueSchema);
