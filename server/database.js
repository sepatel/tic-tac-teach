var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var _ = require('underscore');
var Config = require('../config');

var defer = Q.nfcall(MongoClient.connect, Config.mongo).then(function(mongodb) {
  // Initialize the database
  console.log("Initialized mongodb");
  return mongodb;
}).then(function(mongodb) {
  // Initialize Questions
  var collection = mongodb.collection('questions');
  _.forEach(Config.sightWords, function(words, key) {
    _.forEach(words, function(word) {
      collection.update({
        instruction: "Say the word",
        ask: {text: word}
      }, {
        $set: {
          instruction: "Say the word",
          ask: {text: word},
          clock: 1
        },
        $addToSet: {labels: key}
      }, {upsert: true}, function(error, response) {
        if (error) {
          console.error("Unable to add word", word, error);
        } else if (response.result.upserted) {
          console.info("Injected word", word);
        }
      });
    });
  });

  console.log("Initialized words list");
  return mongodb;
}).then(function(mongodb) {
  var collection = mongodb.collection('player');
  _.forEach(Config.players, function(player, playerId) {
    Q.ninvoke(collection, 'update', {_id: playerId}, {$set: player}, {upsert: true}).then(function(response) {
      if (response.result.upserted) {
        console.info("Created player %s", playerId, player);
      }
    }).catch(function(error) {
      console.error("Unable to update player %s", playerId, player, error);
    });
  });
  console.log("Initialized players");
  return mongodb;
}).catch(function(error) {
  console.error("Error initialization database", Config.mongo, error);
  process.exit(1);
});

module.exports = defer;

