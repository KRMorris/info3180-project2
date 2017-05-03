'use strict';
angular.module('WishList', ['ui.router', 'toaster','ngAnimate',

     
     'satellizer', 
     '720kb.socialshare',
     'angular.vertilize',
     //'ngStorage',
     'WishList.home',
     'WishList.login',
     'WishList.registration',
     'WishList.home1',
     'WishList.userWishList',
     'WishList.sharedWishList'
     //'WishList.modal'
     
    /* 'WishList.logout'*/])
 
    .config(['$stateProvider',function($stateProvider, $urlRouterProvider, $authProvider) {
      //  $urlRouterProvider.otherwise('/' );
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
  //});
   

