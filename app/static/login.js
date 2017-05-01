'use strict';

angular.module('TodoApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: '../static/login.html',
    controller: 'SignInCtrl'
  });
}])

.controller('SignInCtrl', [function() {

}]);

