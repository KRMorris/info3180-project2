'use strict';

angular.module('WishList.home', ['ui.router','ngAnimate', 'toaster', 'satellizer'])

.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider.state('home',{
      url:'/home', 
    templateUrl: '../static/home.html',
    controller: 'homeController',
    data: {restrictedLogin: false}
  })

     $urlRouterProvider.otherwise('/home');        
})


.controller('homeController', [function() {

}])

.run(function ($rootScope, $state, $auth) {
  $rootScope.$on('$stateChangeStart',
    function (event, toState) {
      var requiredLogin = false;
      if (toState.data && toState.data.requiredLogin)
        requiredLogin = true;

      if (requiredLogin && !$auth.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }
    });
});