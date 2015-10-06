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
      nextPlayer(game.lastTurn);
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
        var score = 7 / ((endTime - startTime) / 1000);
        $scope.game.board[x][y] = $scope.currentPlayer.id;
        TTTService.submitTurn($scope.currentPlayer.id, $scope.game._id, score, x, y, question);
        nextPlayer();
      });

      instance.catch(function(reason) {
        switch (reason) {
          case 'timeup':
            TTTService.submitTurn($scope.currentPlayer.id, $scope.game._id, 0, x, y, question);
            break;
          case 'blocked': // don't penalize for being blocked
          case 'backdrop click':
          default:
            TTTService.submitTurn($scope.currentPlayer.id, $scope.game._id, null, x, y, question);
        }
        nextPlayer();
      });
    };

    function nextPlayer(lastTurn) {
      if (players.length == 0) {
        return NotifyService.warning("No Player", "No player could be found for this game. Unable to proceed");
      }
      $scope.currentPlayer = players.splice(0, 1)[0];
      $scope.queuedPlayers = angular.copy(players);
      players.push($scope.currentPlayer);
      if (lastTurn) {
        while ($scope.currentPlayer.id != lastTurn) {
          nextPlayer();
        }
        nextPlayer();
      }
    }
  });

  module.controller('AnswerQuestionCtrl', function($scope, $modalInstance, $interval, player, question) {
    $scope.player = player;
    $scope.question = question;
    $scope.style = "color" + Math.ceil(Math.random() * 5) + " size" + Math.ceil(Math.random() * 5) + " font" + Math.ceil(Math.random() * 5);

    console.info("Question", question);
    $scope.timeToLive = {
      correct: (player.clock || 10) * question.clock,
      block: (player.block || 0) * question.clock
    };

    $scope.correct = function() {
      if ($scope.timeToLive.block == 0) {
        $interval.cancel(threadPromise);
        $modalInstance.close();
      }
    };

    $scope.block = function() {
      if ($scope.timeToLive.block > 0) {
        $interval.cancel(threadPromise);
        $modalInstance.dismiss('blocked');
      }
    };

    var threadPromise = $interval(countdown, 1000);

    function countdown() {
      if ($scope.timeToLive.block > 0) {
        $scope.timeToLive.block--;
      } else {
        $scope.timeToLive.correct--;
      }

      if ($scope.timeToLive.correct == 0) {
        $interval.cancel(threadPromise);
        $modalInstance.dismiss('timeup');
      }
    }
  });
}(angular));
