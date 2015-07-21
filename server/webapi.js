var Q = require('q');
var Utils = require('./utils');
var Database = require('./database');

var mongodb;
Database.then(function(db) {
  console.info("Webapi DB is ready ", db.s.databaseName);
  mongodb = db;
});

module.exports = function(app) {
  var router = app.Router();

  // Create a new game {xPlayer: <profile._id>, oPlayer: <profile._id>, type: 'word|math|...', category: '<label>'}
  router.post('/game', function(req, res) {
    var game = {
      players: {X: req.body.xPlayer, O: req.body.oPlayer},
      rules: { capture: 3, size: 3, type: req.body.type || 'word' },
      board: []
    };

    mongodb.collection('word').find({labels: req.body.category}).toArray(function(err, docs) {
      mongoError(res, err);

      for (var row = 0; row < game.rules.size; row++) {
        var boardRow = [];
        for (var col = 0; col < game.rules.size; col++) {
          var index = Utils.randomInt(0, docs.length);
          boardRow.push({word: docs[index]._id});
          docs.splice(index, 1);
        }
        game.board.push(boardRow);
      }

      mongodb.collection('game').insert(game, function(error, document) {
        mongoError(res, error);
        console.info("Sending back", JSON.stringify(game));
        res.send(game);
      });
    });
  });

  /*
   router.get('/game/:gameId', function(req, res) {
   DataFetcher.getGame(req.params.gameId).then(function(game) {
   console.info("Game to send back is ", game);
   res.status(200);
   res.send(game);
   }).catch(function(error) {
   console.info("Error is ", error);
   res.status(500);
   res.send({error: error});
   });
   });

   router.delete('/build/:id', function(req, res) {
   DataFetcher.build.remove(req.params.id).then(function(guide) {
   res.status(200);
   res.send(guide);
   }).catch(function(error) {
   console.info("Error is ", error);
   res.status(500);
   res.send({error: error});
   });
   });


   router.post('/build', function(req, res) {
   console.info("Save Guide", req.body);
   DataFetcher.build.save(req.body).then(function(guide) {
   res.status(200);
   res.send(guide);
   }).catch(function(error) {
   console.info("Error is ", error);
   res.status(500);
   res.send({error: error});
   });
   });
   */

  return router;
};

function mongoError(response, error) {
  if (error) {
    response.status(500);
    response.send({error: error});
    throw error;
  }
}