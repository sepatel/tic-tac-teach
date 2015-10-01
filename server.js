var Q = require('q');
var Express = require('express');
var BodyParser = require('body-parser');
var Config = require('./config');
var Database = require('./server/database');
var Realtime = require('./server/realtime');
var Webapi = require('./server/webapi')(Express);

var app = Express();
var http = require('http').Server(app);
var WebSocketServer = require('ws').Server;

Webapi.get('/version', function(req, res) {
  res.send({release: Config.version, erase: []});
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));
app.use(Express.static(__dirname + '/client'));

app.use('/', Webapi);

app.use(function(req, res) {
  res.status(404).send({code: 'notFound', message: 'Web Service Not Found'});
});

app.use(function(error, req, res) {
  res.status(500).send({code: 'serverError', message: 'Internal Server Error'});
});

Database.then(function() { // startup server after the db is initialized
  var server = http.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Tic-Tac-Teach listening on http://%s:%s', host, port);
  });

  var wss = new WebSocketServer({server: server});
  wss.on('connection', function(ws) {
    Realtime(ws);
  });
}).catch(function(error) {
  console.error("Unable to startup server", error);
});

