var Database = require('./database');

Database.then(function(db) {
  console.info("Util DB %s is ready ", db.s.databaseName);
});

module.exports = {
  randomInt: function(min, max) {
    if (max === undefined) {
      max = min;
      min = 1;
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }
};
