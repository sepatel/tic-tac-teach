var Q = require('q');
var Utils = require('./utils');
var Database = require('./database');

var mongodb;
Database.then(function(db) {
  console.info("Webapi DB %s is ready ", db.s.databaseName);
  mongodb = db;
});

module.exports = {
  newGame: function(data) {
    var defer = Q.defer();
    console.info("New Game Request", data);
    var game = {
      _id: Utils.uuid(),
      players: {X: data.xPlayer, O: data.oPlayer},
      rules: { capture: 3, size: 3, type: data.type || 'word' },
      board: []
    };

    mongodb.collection('word').find({labels: data.category}).toArray(function(err, docs) {
      if (err) {
        return defer.reject(err);
      }

      for (var row = 0; row < game.rules.size; row++) {
        var boardRow = [];
        for (var col = 0; col < game.rules.size; col++) {
          var index = Utils.randomInt(0, docs.length);
          boardRow.push({word: docs[index]._id});
          docs.splice(index, 1);
        }
        game.board.push(boardRow);
      }

      return defer.resolve(game);
      /*
      mongodb.collection('game').insert(game, function(error, document) {
        if (error) {
          return defer.reject(error);
        }
        console.info("Creating New Game", JSON.stringify(game));
        return defer.resolve(game);
      });
      */
    });
    return defer.promise;
  },
  getAllGames: function() {
    var defer = Q.defer();
    mongodb.collection('game').find({winner: null}).toArray(function(error, docs) {
      if (error) {
        return defer.reject(error);
      }
      return defer.resolve(docs);
    });
    return defer.promise;
  }
};

