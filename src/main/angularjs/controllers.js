(function(angular) {
  var module = angular.module('app.controllers', ['app.newGame', 'app.playGame']);

  /*
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

   module.controller('PlayGameCtrl', function($scope, $timeout, $routeParams, AnnyangService, TTTService) {
   TTTService.getGame($routeParams.gameId).then(function(game) {
   $scope.game = game;
   //AnnyangService.start();
   });

   $scope.xTurn = true;

   $scope.flipCard = function(tile) {
   $scope.ui = {
   type: "tileType" + Math.floor(Math.random() * 5),
   size: "tileSize" + Math.floor(Math.random() * 5),
   style: "tileStyle" + Math.floor(Math.random() * 5)
   };

   var flippable = true;
   angular.forEach($scope.game.board, function(row) {
   angular.forEach(row, function(col) {
   if (col.flipped) {
   flippable = false;
   }
   });
   });

   if (flippable) {
   tile.flipped = true;

   tile.timer = $timeout(function() {
   delete tile.timer;
   endTurn(tile);
   }, 10000);
   }
   };

   $scope.steal = function(tile) {
   tile.owner = ($scope.xTurn) ? 'O' : 'X';
   endTurn(tile);
   };

   $scope.correct = function(tile) {
   tile.owner = ($scope.xTurn) ? 'X' : 'O';
   endTurn(tile);
   };

   function endTurn(tile) {
   $timeout.cancel(tile.timer);
   tile.flipped = false;
   $scope.xTurn = !$scope.xTurn;
   delete $scope.tileType;
   }
   });
   */
}(angular));
