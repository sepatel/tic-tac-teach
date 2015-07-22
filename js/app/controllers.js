(function(angular) {
  var module = angular.module('app.controllers', ['app.services']);

  module.controller('NewGameCtrl', function($scope, $location, TTTService) {
    $scope.form = {
      xPlayer: 'Moksh Patel', // TODO: Replace with activeUser from the navigation
      oPlayer: null,
      type: 'word',
      category: null
    };

    $scope.users = [
      {label: 'Computer', value: null},
      {label: 'Moksh Patel', value: 'Moksh Patel'},
      {label: 'Saarth Patel', value: 'Saarth Patel'},
      {label: 'Mital Patel', value: 'Mital Patel'},
      {label: 'Sejal Patel', value: 'Sejal Patel'}
    ];

    $scope.createGame = function() {
      TTTService.newGame($scope.form).then(function(game) {
        console.info("New game created", game);
        $location.path("/game/" + game._id);
      });
    };
  });

  module.controller('PlayGameCtrl', function($scope, $routeParams, TTTService) {
    TTTService.getGame($routeParams.gameId).then(function(game) {
      $scope.game = game;
    });
  });
}(angular));
