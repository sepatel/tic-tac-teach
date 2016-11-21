(function(angular) {
  var module = angular.module('app.navigation', ['ngRoute', 'app.services']);

  module.config(function($routeProvider) {
    $routeProvider.when('/', {label: 'Home', controller: 'HomeCtrl', templateUrl: '/home.html'});
    //$routeProvider.when('/', {controller: 'NewGameCtrl', templateUrl: '/new-game.html'});
    $routeProvider.when('/game/:gameId', {
      label: 'Game :gameId',
      //controller: 'PlayGameCtrl',
      templateUrl: '/tic-tac-game.html'
    });
    $routeProvider.otherwise({redirectTo: '/'});
  });

  module.run(function($rootScope, $location, $routeParams) {
    if (!$rootScope.breadcrumbs || $rootScope.breadcrumbs.length == 0) {
      $rootScope.breadcrumbs = [{label: 'Home', link: '/'}];
      $rootScope.breadcrumbs.link = function(index) {
        if (index < $rootScope.breadcrumbs.length - 1) {
          var x = $rootScope.breadcrumbs.splice(index);
          $location.path(x[0].link);
        }
      }
    }

    $rootScope.$on('$routeChangeSuccess', function(event, next) {
      var breadcrumb = {label: next.label || '<unknown>', link: next.$$route.originalPath};
      var keys = next.$$route.keys;
      var value;
      for (var i = 0; i < keys.length; i++) {
        if (angular.isDefined(keys[i]) && angular.isDefined(keys[i].name)) {
          value = next.pathParams[keys[i].name];
          var regEx = new RegExp(":" + keys[i].name, "gi");
          breadcrumb.link = breadcrumb.link.replace(regEx, value.toString());
          breadcrumb.label = breadcrumb.label.replace(regEx, value.toString());
        }
      }

      var crumbs = $rootScope.breadcrumbs.filter(function(x) {
        return x.link == breadcrumb.link;
      });
      if (crumbs.length > 0) {
        var index = $rootScope.breadcrumbs.indexOf(crumbs[0]);
        $rootScope.breadcrumbs.splice(index, 1);
      }
      $rootScope.breadcrumbs.push(breadcrumb);
    });
  });
}(angular));

