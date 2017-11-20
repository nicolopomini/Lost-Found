var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var IssueSchema = new Schema({
  //document property: SchemaType
  time: {type: Date, default: null},
  room: {type: String, default: ''},
  description: {type: String, default: ''},
  author: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'},
  photo: {type: String, default: null}
});

//adding tag elaboration API
//using .methods given by schema
IssueSchema.methods.generateTags = function() {
  if(this.description.length > 0){

  }
}

//searchning for related issues by comparing tags
IssueSchema.methods.searchRelatedIssues = function() {
  
}

//exporting Issue object
module.exports = mongoose.model('Issue', IssueSchema);
