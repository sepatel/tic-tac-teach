var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var _ = require('underscore');
var Config = require('../config');

var defer = Q.nfcall(MongoClient.connect, Config.mongo).then(function(mongodb) {
  // Initialize the database
  console.log("Initialized mongodb");
  return mongodb;
}).then(function(mongodb) {
  // Initialize the dictionary
  var collection = mongodb.collection('word');
  _.forEach(Config.initWords, function(word) {
    collection.update({_id: word}, {_id: word}, {upsert: true}, function(error, response) {
      if (error) {
        console.error("Unable to add word", word, error);
      } else if (response.result.upserted) {
        console.info("Injected word", word);
      }
    });
  });
  console.log("Initialized words list");
  return mongodb;
}).catch(function(error) {
  console.error("Error initialization database", Config.mongo, error);
  process.exit(1);
});

module.exports = defer;

