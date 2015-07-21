(function(angular) {
  var module = angular.module('app.navigation', ['ngRoute', 'app.services']);

  module.config(function($routeProvider) {
    $routeProvider.when('/newGame', {controller: 'NewGameCtrl', templateUrl: 'app/new-game.html'});
    $routeProvider.when('/game/:gameId', {controller: 'PlayGameCtrl', templateUrl: 'app/play-game.html'});
    $routeProvider.when('/theme', {controller: 'ThemeCtrl', templateUrl: 'app/theme.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  });
}(angular));

