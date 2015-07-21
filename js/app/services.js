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

    function $patch(url, data) {
      return $http.patch(url, data).then(successHandler, errorHandler);
    }

    function $post(url, data) {
      return $http.post(url, data).then(successHandler, errorHandler);
    }

    function $put(url, data) {
      return $http.put(url, data).then(successHandler, errorHandler);
    }

    return {
      newGame: function(options) {
        // TODO: Determine the players to play in the new game plus other options (rules, category, type, size, ...)
        return $post('/api/game').then(function(game) {
          NotifyService.success("New Game", "New game has been started, have fun");
          return game;
        });
      }
    }
  });
}(angular));

