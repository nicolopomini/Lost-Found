var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: {type: String, required: true, unique: true},
	name: {type: String, required: true},
	email: {type: String, validate: {
		validator: (v) => {
			return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
		}
	}, required: true
	}
});

//returns if the user is authenticated or not
UserSchema.methods.isAuth = function() {}

module.exports = mongoose.model('User', UserSchema);
