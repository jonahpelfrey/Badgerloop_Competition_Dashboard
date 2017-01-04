var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Message = require('./message.js');

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname,  'views')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dev Connection
mongoose.connect('mongodb://localhost/bloop');

// Setup Router
var router = express.Router();

// Notify on any request
router.use(function(req, res, next) {
	console.log('Request Made');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'Message Logging API' });
});

// Route for CAN messages ========================================
router.route('/messages')
	.post(function(req, res) {

		var message = new Message();
		message.module = req.body.module;
		message.data = req.body.data;

		message.save(function(err) {
			if(err) res.send(err);
			else { res.json({ message: 'Message created' }); }
		});

	})

	.get(function(req, res) {
		Message.find(function(err, messages) {
			if(err) res.send(err);
			else { res.json(messages); }
		});
	});

// Register route ================================================
app.use('/logging', router);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Collection Server listening on port ' + app.get('port'));
});
