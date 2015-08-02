var Q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var webapi = require('./server/webapi');
var Config = require('./config');
var Database = require('./server/database');

var app = express();
var http = require('http').Server(app);
var WebSocketServer = require('ws').Server;

var router = express.Router();
router.get('/version', function(req, res) {
  res.send({release: Config.version, erase: []});
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));

//app.use('/api', webapi);
router.post('/game', function(req, res) {
  webapi.newGame(req.body).then(function(game) {
    res.send(game);
  }).catch(function(error) {
    res.status(500);
    res.send({error: error});
  });
});
app.use('/', router);

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

    console.log('Example app listening at http://%s:%s', host, port);
  });

  var wss = new WebSocketServer({server: server});
  wss.on('connection', function(ws) {
    webapi.getAllGames().then(function(games) {
      sendMessage(ws, "allGames", games);
    }).catch(function(error) {
      sendMessage(ws, "error", {code: 'serverError', message: 'Unable to retrieve games', error: error});
    });

    ws.on('message', function incoming(message) {
      try {
        message = JSON.parse(message);
      } catch (e) {
        console.error("Unable to format", message, e);
      }
      if (message.event && webapi[message.event]) {
        webapi[message.event](message.data).then(function(response) {
          sendMessage(ws, message.event, response);
        }).catch(function(error) {
          sendMessage(ws, "error", {code: 'serverError', message: 'Unable to retrieve games', error: error});
        });
      } else {
        sendMessage(ws, "error", {code: "unknownCommnad", message: message});
      }
    });
  });
}).catch(function(error) {
  console.error("Unable to startup server", error);
});

function sendMessage(ws, event, payload) {
  ws.send(JSON.stringify({event: event, data: payload}), function(error) {
    if (error) {
      console.error("Error sending message", payload, error);
    }
  });
}
