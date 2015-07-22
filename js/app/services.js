(function(angular) {
  var module = angular.module('app.services', ['ssNotify']);

  module.service('TTTService', function($http, $q, NotifyService) {
    function successHandler(result) {
      return result.data;
    }

    function errorHandler(response) {
      console.error("Something broke", response);
    }

    function $delete(url) {
      return $http['delete'](url).then(successHandler, errorHandler);
    }

    function $get(url) {
      return $http.get(url).then(successHandler, errorHandler);
    }

    function $post(url, data) {
      return $http.post(url, data).then(successHandler, errorHandler);
    }

    function $put(url, data) {
      return $http.put(url, data).then(successHandler, errorHandler);
    }

    var gamesList;
    var me = {
      getAllGames: function() {
        if (gamesList) {
          return $q.resolve(gamesList);
        }

        return $get('/api/games').then(function(games) {
          gamesList = games;
          return gamesList;
        });
      },
      getGame: function(gameId) {
        var defer = $q.defer();
        me.getAllGames().then(function(games) {
          angular.forEach(games, function(game) {
            if (game._id == gameId) {
              defer.resolve(game);
            }
          });
        });
        return defer.promise;
        //return $get('/api/game/' + gameId);
      },
      newGame: function(options) {
        console.info("Creating new game with ", options);
        // TODO: Determine the players to play in the new game plus other options (rules, category, type, size, ...)
        return $post('/api/game', options).then(function(game) {
          NotifyService.success("New Game", "New game has been started, have fun");
          gamesList.push(game);
          return game;
        });
      }
    };

    return me;
  });
}(angular));

