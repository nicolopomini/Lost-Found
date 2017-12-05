var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: {type: String, minlength: 1},
	name: {type: String, minlength: 1},
	email: {type: String, minlength: 1}
});

//returns if the user is authenticated or not
UserSchema.methods.isAuth = function() {}

module.exports = mongoose.model('User', UserSchema);
