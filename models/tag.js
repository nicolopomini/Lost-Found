var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Issue = require('./issue');

var TagSchema = new Schema({
	name: {type: String},
	issues: [{type: mongoose.Schema.Types.ObjectId,  ref: 'Issue'}]
});

module.exports = mongoose.model('Tag', TagSchema);
