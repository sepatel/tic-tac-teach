var Database = require('./database');
var ObjectID = require('mongodb').ObjectID;

Database.then(function(db) {
  console.info("Util DB %s is ready ", db.s.databaseName);
});

module.exports = {
  objectId: function(string) {
    try {
      return new ObjectID(string);
    } catch (e) { // not a valid objectid format so fallback to string literal
      return string;
    }
  },
  uuid: function() {
    return new ObjectID();
  },
  randomInt: function(min, max) {
    if (max === undefined) {
      max = min;
      min = 1;
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }
};
