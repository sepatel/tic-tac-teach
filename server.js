var Q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./server/webapi')(express);
var Config = require('./config');
var Database = require('./server/database');

var app = express();

var router = express.Router();
router.get('/version', function(req, res) {
  res.send({release: Config.version, erase: []});
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));

app.use('/api', apiRouter);
app.use('/', router);

app.use(function(req, res) {
  res.status(404).send({code: 404, message: 'Web Service Not Found'});
});

app.use(function(error, req, res) {
  res.status(500).send({code: 500, message: 'Internal Server Error'});
});

Database.then(function() { // startup server after the db is initialized
  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}).catch(function(error) {
  console.error("Unable to startup server", error);
});
