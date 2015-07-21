(function(angular) {
  var module = angular.module('app.controllers', ['app.services']);

  module.controller('NewGameCtrl', function($scope, $location, TTTService) {
    $scope.form = {
      xPlayer: 'mopatel', // TODO: Replace with activeUser from the navigation
      oPlayer: null,
      type: 'word',
      category: null
    };

    $scope.users = [
      {label: 'Computer', value: null},
      {label: 'Moksh Patel', value: 'mopatel'},
      {label: 'Saarth Patel', value: 'sapatel'},
      {label: 'Mital Patel', value: 'mipatel'},
      {label: 'Sejal Patel', value: 'sepatel'}
    ];

    $scope.createGame = function() {
      TTTService.newGame($scope.form).then(function(game) {
        console.info("New game created", game);
        $location.path("/game/" + game._id);
      });
    };
  });
}(angular));
