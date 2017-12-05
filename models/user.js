var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: {type: String, minlength: 1, unique: true},
	name: {type: String, minlength: 1},
	email: {type: String, validate: {
		validator: (v) => {
			return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/.test(v);
		}
	}, required: true
	}
});

//returns if the user is authenticated or not
UserSchema.methods.isAuth = function() {}

module.exports = mongoose.model('User', UserSchema);
