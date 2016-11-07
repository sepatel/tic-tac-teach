(function(angular) {
  var module = angular.module('app.newGame', ['app.services']);

  module.controller('NewGameCtrl', function($scope, $location, $mdToast, TTTService) {
    $scope.newGameForm = {
      players: [],
      size: 4
    };

    TTTService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    TTTService.getAllGames().then(function(games) {
      $scope.games = games;
    });

    $scope.toggleJoin = function(player) {
      var index = -1;
      angular.forEach($scope.newGameForm.players, function(p, i) {
        console.info("Player", i);
        if (player._id == p.id) {
          index = i;
        }
      });

      if (index == -1) {
        if ($scope.newGameForm.players.length + 1 < $scope.newGameForm.size) {
          player.active = true;
          $scope.newGameForm.players.push({id: player._id, level: player.level});
        } else {
          $mdToast.show($mdToast.simple().textContent("Please choose a bigger board to allow more players"));
        }
      } else {
        player.active = false;
        $scope.newGameForm.players.splice(index, 1);
      }
    };

    $scope.createGame = function() {
      var form = $scope.newGameForm;
      if (form.players.length) {
        $scope.newGameForm = {
          players: [],
          size: 4
        };

        TTTService.newGame(form).then($scope.resumeGame);
      }
    };

    $scope.deleteGame = function(game) {
      TTTService.deleteGame(game._id).then(function(success) {
        var index = $scope.games.indexOf(game);
        if (index != -1) {
          $scope.games.splice(index, 1);
        }
      });
    };

    $scope.resumeGame = function(game) {
      $location.path('/game/' + game._id);
    };
  });
}(angular));
