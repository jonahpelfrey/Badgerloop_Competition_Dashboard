var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	module: String,
	timestamp: {type: Date, default: Date.now },
	data: String
});

module.exports = mongoose.model('Message', MessageSchema);