(function(angular) {
  var module = angular.module('app.navigation', ['ngRoute', 'app.services']);

  module.config(function($routeProvider) {
    $routeProvider.when('/', {controller: 'NewGameCtrl', templateUrl: 'app/new-game.html'});
    $routeProvider.when('/game/:gameId', {controller: 'PlayGameCtrl', templateUrl: 'app/tic-tac-game.html'});
    $routeProvider.when('/theme', {controller: 'ThemeCtrl', templateUrl: 'app/theme.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  });

  module.controller('NavigationCtrl', function($scope, $location, TTTService) {
    TTTService.getAllGames().then(function(games) {
      $scope.games = games;
    });

    $scope.createGame = function(label) {
      TTTService.newGame({
        xPlayer: 'Moksh Patel',
        oPlayer: null,
        type: 'word',
        category: label
      }).then(function(game) {
        //console.info("New game created", game);
        $location.path("/game/" + game._id);
      });
    };
  });
}(angular));

