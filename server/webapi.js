var Services = require('./services');

module.exports = function(express) {
  var router = express.Router();

  router.get('/games', function(req, res) {
    Services.getActiveGames().then(function(games) {
      res.send(games);
    }).catch(errorHandler(res));
  });

  // POST /game {players: [{id: playerId, level: <label(s)>}]}
  router.post('/game', function(req, res) {
    Services.newGame(req.body).then(function(game) {
      res.send(game);
    }).catch(errorHandler(res));
  });

  // GET /game/1234
  router.get('/game/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    Services.getGame(gameId).then(function(game) {
      res.send(game);
    }).catch(errorHandler(res));
  });

  // DELETE /game/1234
  router.delete('/game/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    Services.deleteGame(gameId).then(function(result) {
      console.info("Deleted game %s with result", gameId, result.result);
      res.send((result.result.n > 0));
    }).catch(errorHandler(res));
  });

  // GET /game/1234/player/abc
  // Return the words this player should be focusing on
  router.get('/game/:gameId/player/:playerId', function(req, res) {
    var gameId = req.params.gameId;
    var playerId = req.params.playerId;
  });

  // GET /players
  router.get('/players', function(req, res) {
    Services.getPlayers().then(function(players) {
      res.send(players);
    }).catch(errorHandler(res));
  });

  // GET /player/apple
  router.get('/player/:playerId', function(req, res) {
    Services.getPlayer(req.params.playerId).then(function(player) {
      res.send(player);
    }).catch(errorHandler(res));
  });

  return router;
};

function errorHandler(res) {
  return function(error) {
    res.status(500);
    res.send({error: error});
  }
}
