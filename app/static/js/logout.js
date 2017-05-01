angular.module('WishList.logout', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/api/user/logout', {
    templateUrl: '../static/l.html',
    controller: 'logoutController',
    access: {restricted: true}
  });
}])
        .controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope,$http, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/api/user/login');
        });

    };

}]);