(function(angular) {
  var module = angular.module('app.services', ['ssNotify', 'ngWebsocket']);

  module.service('TTTService', function($http, $interval, $q, $websocket, NotifyService) {
    function successHandler(result) {
      return result.data;
    }

    function errorHandler(response) {
      console.error("Something broke", response);
      NotifyService.danger("Error", JSON.stringify(response));
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

    ws.$on('allGames', function(payload) {
      console.info("All Games Info received", typeof payload, payload);
    });
    ws.$on('$message', function(data, flags) {
      console.info("Data", data, "Flags", flags);
    });
    ws.$on('$open', function() {
      NotifyService.info('Server Connection', "The server connection has opened.", 2);
    });
    ws.$on('$close', function() {
      NotifyService.info('Server Error', "The server connection has closed. Auto retrying.", 2);
    });

    var playerMap;
    var me = {
      sendMessage: function(event, data) {
        // TODO: Strip out all of the $$hashKey and other angular internals
        return ws.$emit(event, data);
      },
      deleteGame: function(gameId) {
        return $delete('/game/' + gameId);
      },
      getAllGames: function() {
        return $get('/games');
      },
      getGame: function(gameId) {
        return $get('/game/' + gameId);
      },
      newGame: function(options) {
        console.info("Creating new game with ", options);
        return $post('/game', options).then(function(game) {
          NotifyService.success("New Game", "New game has been started, have fun");
          console.info("New game created", game);
          return game;
        });
      },
      getPlayer: function(playerId) {
        return $get('/player/' + playerId);
      },
      getPlayers: function() {
        if (playerMap) {
          return $q.when(playerMap);
        }

        return $get('/players').then(function(players) {
          playerMap = {};
          angular.forEach(players, function(player) {
            playerMap[player._id] = player;
          });
          return playerMap;
        });
      },

      submitTurn: function(playerId, gameId, score, row, col, question) {
        me.sendMessage("submitTurn", {
          player: playerId,
          gameId: gameId,
          correct: score > 0,
          row: row,
          col: col,
          question: question,
          score: score
        });
      }
    };

    return me;
  });
}(angular));
