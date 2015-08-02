(function(annyang) {
  'use strict';

}(window.annyang));

(function(angular, annyang) {
  var module = angular.module('app.services', ['ssNotify', 'ngWebsocket']);

  module.service('AnnyangService', function AnnyangService($rootScope) {
    var service = {};

    // COMMANDS
    service.commands = {};

    service.addCommand = function(phrase, callback) {
      var command = {};

      // Wrap annyang command in scope apply
      command[phrase] = function(args) {
        $rootScope.$apply(callback(args));
      };

      // Extend our commands list
      angular.extend(service.commands, command);

      // Add the commands to annyang
      annyang.addCommands(service.commands);
      console.debug('added command "' + phrase + '"', service.commands);
    };

    service.removeCommand = function(phrase) {
      delete service.commands[phrase];
      annyang.removeCommands(phrase);
    };

    service.start = function() {
      annyang.addCommands(service.commands);
      annyang.debug(true);
      annyang.start();
    };

    return service;
  });

  module.service('TTTService', function($http, $interval, $q, $websocket, NotifyService) {
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

    var ws = $websocket.$new({
      url: 'ws://localhost:3000',
      reconnect: true,
      reconnectInterval: 2500
    });
    console.info("WebService", ws);

    var gamesList = [];
    ws.$on('allGames', function(payload) {
      console.info("All Games Info received", typeof payload, payload);
      gamesList.length = 0;
      angular.forEach(payload, function(item) {
        gamesList.push(item);
      });
    });
    ws.$on('$message', function(data, flags) {
      console.info("Data", data, "Flags", flags);
      //NotifyService.info('Message', "Data: " + JSON.stringify(data) + "\nFlags: " + flags);
    });
    ws.$on('$open', function() {
      NotifyService.info('Server Connection', "The server connection has opened.", 2);
    });
    ws.$on('$close', function() {
      NotifyService.info('Server Error', "The server connection has closed. Auto retrying.", 2);
    });
    var me = {
      sendMessage: function(event, data) {
        // TODO: Strip out all of the $$hashKey and other angular internals
        return ws.$emit(event, data);
      },
      getAllGames: function() {
        var defer = $q.defer();

        var stop = $interval(function() {
          if (gamesList.length) {
            $interval.cancel(stop);
            return defer.resolve(gamesList);
          }
        }, 1000);

        return defer.promise;
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
      },
      newGame: function(options) {
        console.info("Creating new game with ", options);
        // TODO: Determine the players to play in the new game plus other options (rules, category, type, size, ...)
        return $post('/game', options).then(function(game) {
          NotifyService.success("New Game", "New game has been started, have fun");
          gamesList.push(game);
          return game;
        });
      }
    };

    return me;
  });
}(angular, window.annyang));
