var _ = require('underscore');
var Q = require('q');
var Utils = require('./utils');
var Database = require('./database');
var Config = require('../config');

var mongodb;
Database.then(function(db) {
  console.info("Webapi DB %s is ready ", db.s.databaseName);
  mongodb = db;
});

module.exports = {
  newGame: function(data) {
    var defer = Q.defer();
    var game = {
      _id: Utils.uuid(),
      board: [],
      players: [],
      created: new Date()
    };

    var wordLists = [];
    _.forEach(data.players || [], function(player) {
      var player = {id: player.id, level: player.level};
      game.players.push(player);
      wordLists.push(generatePlayerQuestions(player.id, player.level).then(function(questions) {
        player.questions = questions;
        return player;
      }));
    });

    if (game.players.length == 0) {
      // TODO: does return defer.reject work? Probably so ...
      return Q.reject("No players found");
    }

    for (var row = 0; row < data.size; row++) {
      var boardRow = [];
      for (var col = 0; col < data.size; col++) {
        boardRow.push(null);
      }
      game.board.push(boardRow);
    }

    Q.all(wordLists).done(function(players) {
      mongodb.collection('game').insert(game, function(error, document) {
        if (error) {
          return defer.reject(error);
        }
        return defer.resolve(game);
      });
    });

    return defer.promise;
  },

  deleteGame: function(id) {
    return Q.ninvoke(mongodb.collection('game'), "remove", {_id: Utils.objectId(id)});
  },

  getGame: function(id) {
    return Q.ninvoke(mongodb.collection('game'), "findOne", {_id: Utils.objectId(id)});
  },

  getActiveGames: function() {
    return qFind('game', {winner: null});
  },

  getPlayer: function(id) {
    return Q.ninvoke(mongodb.collection('player'), "findOne", {_id: id});
  },

  getPlayers: function() {
    return qFind('player', {});
  },

  // payload = {gameId: 1234, correct: true, row: number, col: number, player: <playerId>, question: string, score: 0.81}
  submitTurn: function(payload) {
    if (payload.score == null) {
      return Q.ninvoke(mongodb.collection('game'), "update", {
        _id: Utils.objectId(payload.gameId)
      }, {$set: {
        lastTurn: payload.player
      }});
    }

    var questionUpdate = {};
    questionUpdate[payload.word] = {$inc: {score: payload.score || 0, attempts: 1}};
    var promise = Q.ninvoke(mongodb.collection('playerStats'), "update", {
      _id: { player: Utils.objectId(payload.player), question: Utils.objectId(payload.question) }
    }, {
      $inc: {score: payload.score || 0, attempts: 1}
    }, {upsert: true}).then(function(response) {
      console.info("Successful update of stats", response);
      return response.result;
    }).catch(function(error) {
      console.error("Unsuccessful update of stats", error);
      throw error;
    });

    console.info("Submitted Turn", payload);
    if (payload.correct) {
      var key = "board." + payload.row + "." + payload.col;
      var update = { lastTurn: payload.player };
      update[key] = payload.player;
      Q.ninvoke(mongodb.collection('game'), "update", {_id: Utils.objectId(payload.gameId)}, {$set: update});
    }
    return promise;
  }
};

function qFind(collectionName, query, fields, options) {
  var defer = Q.defer();
  mongodb.collection(collectionName).find(query, fields, options).toArray(function(error, docs) {
    if (error) {
      return defer.reject(error);
    }
    return defer.resolve(docs);
  });
  return defer.promise;
}

function generatePlayerQuestions(playerId, label) {
  var defer = Q.defer();

  // TODO: Factor in the weighted averages of the score
  var questions = [];

  return qFind('questions', {labels: {$in: label}}, {labels: 0}).then(function(questions) {
    var toAsk = [];

    while (toAsk.length < 10 && questions.length) {
      toAsk.push(questions[Math.floor(Math.random() * questions.length)]);
    }

    return toAsk;
  });

  return defer.promise;
}