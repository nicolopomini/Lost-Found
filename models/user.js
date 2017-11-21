var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {type: String},
	surname: {type: String},
	email: {type: String},
	password: {type: String}
});

//returns if the user is authenticated or not
UserSchema.methods.isAuth = function() {}

module.exports = mongoose.model('User', UserSchema);
