var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var IssueSchema = new Schema({
  //document property: SchemaType
  time: {type: Date, default: null},
  room: {type: String, default: '0'}, //using -1 as unvalid
  description: {type: String, default: ''},
  author: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'},
  photo: {type: String, default: null}
});

//exporting Issue object
module.exports = mongoose.model('Issue', IssueSchema);
