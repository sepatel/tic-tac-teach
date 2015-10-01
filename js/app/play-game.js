(function(angular) {
  var module = angular.module('app.playGame', ['app.services']);

  module.controller('PlayGameCtrl', function($scope, $location, $modal, $routeParams, NotifyService, TTTService) {
    var players = [];
    TTTService.getPlayers().then(function(players) {
      $scope.playerMap = players;
    });
    TTTService.getGame($routeParams.gameId).then(function(game) {
      if (!game) {
        return $location.path("/");
      }
      $scope.game = game;
      players = angular.copy(game.players);
      nextPlayer();
    });

    $scope.chooseCell = function(x, y) {
      if ($scope.game.board[x][y]) {
        // Cell already owned by somebody. Later consider "stealing" or "uncapturing" game concepts
        return;
      }

      var list = $scope.currentPlayer.questions;
      var question = list[Math.floor(Math.random() * list.length)];

      var startTime = +new Date();
      var instance = $modal.open({
        templateUrl: 'app/answer-question.html',
        controller: 'AnswerQuestionCtrl',
        resolve: {
          player: function() {
            return angular.extend({}, $scope.currentPlayer, $scope.playerMap[$scope.currentPlayer.id]);
          },
          question: function() {
            return question;
          }
        }
      }).result;

      instance.then(function() {
        var endTime = +new Date();
        var score = ((endTime - startTime) / 1000) / 7; // TODO: 7 should be user config setting
        $scope.game.board[x][y] = $scope.currentPlayer.id;
        TTTService.submitTurn($scope.currentPlayer.id, $scope.game._id, score, x, y, question);
        nextPlayer();
      });

      instance.catch(function() {
        if (question) {
          TTTService.submitTurn($scope.currentPlayer.id, $scope.game._id, 0, x, y, question);
        }
        nextPlayer();
      });
    };

    function nextPlayer() {
      if (players.length == 0) {
        return NotifyService.warning("No Player", "No player could be found for this game. Unable to proceed");
      }
      $scope.currentPlayer = players.splice(0, 1)[0];
      $scope.queuedPlayers = angular.copy(players);
      players.push($scope.currentPlayer);
    }
  });

  module.controller('AnswerQuestionCtrl', function($scope, $modalInstance, $timeout, player, question) {
    $scope.player = player;
    $scope.question = question;

    //$scope.timeToLive = player.clock;

    $scope.correct = function() {
      $modalInstance.close();
    };
  });
}(angular));
