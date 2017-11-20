var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB instances
var tag = require("../models/tag");
var user = require("../models/user");
var issue = require("../models/issue");

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    user: 'se2',
    pass: 'qwerty'
  };
mongoose.connect('mongodb://se2:qwerty@ds115625.mlab.com:57185/lostfound', options);
const db = mongoose.connection;
//gli errori dovrebbe gestirli da soli con la funzione in app.js

router.get('/:query', function(req, res) {
	var query = req.params.query;
	//inviare la query a IBM Watson
	//leggere il JSON resituito
	//ricercare le issues corrispondenti
	res.send("Hai cercato: " + query);
});
router.post('/', function(req, res) {
	var room = req.query.room;
	var description = req.query.description;
	var author = req.query.author;
	if(room && description && author) {
		res.send(room + " " + description + " " + author);
	}
	else {
		res.send("Missing parameters");
	}
});

module.exports = router;