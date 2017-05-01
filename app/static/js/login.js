'use strict';

angular.module('WishList.login', ['ui.router', 'toaster','ngAnimate','satellizer'])


        .config(['$stateProvider',function ($stateProvider, $urlRouterProvider,toaster, $authProvider) {
         $stateProvider.state('login', {
             url: '/api/user/login',
     templateUrl: '../static/login.html',
      controller: 'SignInCtrl'
    });
//$urlRouterProvider.otherwise('/home');
        }])

//Email:erean@mail.com Password:456789j Name:Mello Drama Email:yesman@email.com Password:strongman
.controller('SignInCtrl',
  ['$scope','$state', '$auth','$http','AuthService','toaster',//'sessionStorage',
  function ($scope,$state,$auth,$http,AuthService ,toaster,$window,$q) {
  
    $scope.login = function () {
       //$auth.login({email: $scope.loginForm.email, password: $scope.loginForm.password})
      $http.post('api/user/login',{email: $scope.loginForm.email, password: $scope.loginForm.password})
                .then(function (response) {
          //alert('help');
           //shared.parseUser(response,deffered);
           //console.log(response.data);
            // $auth.setToken(response.data);
            var data=response.data
            var g=data.token
            
            //$auth.setToken(g);
            localStorage.setItem("satellizer_token",JSON.stringify(g));
            //alert(g);
            //console.log(g)
        $state.go('mywishlist');
      })
      .catch(function (error) {
         // alert(error);
         /*var jkl=error.data;
         console.log(error.data.error)*/
          toaster.pop({
                type:'error',
                title:'Login Error',
                body:error.data.error,
                timeout: 0,
                showCloseButton: true
          
          });
      })
    };
    $scope.pop=function(){
      toaster.pop('warning', "warning",'Error');
    }
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
  /*.config(['$routeProvider', function($routeProvider,$authProvider) {
  $routeProvider.when('/api/user/login', {
    templateUrl: '../static/login.html',
    controller: 'SignInCtrl',
    access: {restricted: false}
  });
}])*/
/*
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      //AuthService.login($scope.loginForm.email, $scope.loginForm.password)
      $auth.login({email: $scope.loginForm.email, password: $scope.loginForm.password})
// handle success
        .then(function(response){
            console.log(response);
          $auth.setToken(response);
          $location.path('/api/user/add/wishlist');
      })
      .catch(function (response) {
        toastr.error(
          'Email or password not correct!',
          {closeButton: true}
        );
      });
        
        
        
        
        
        /*.then(function () {
          $location.path('/api/user/add/wishlist');
          
          $scope.disabled = false;
          $scope.loginForm = {};
          
          
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };
    
 $scope.auth = function (provider) {
    $auth.authenticate(provider)
      .then(function (response) {
        console.debug("success", response);
        $state.go('secret');
      })
      .catch(function (response) {
        console.debug("catch", response);
      })
  }
}])
.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
              .then(function(){
        if (next.access.restricted &&
          !AuthService.isLoggedIn()) {
        $location.path('/api/user/login');
        $route.reload();
      }
              });
  });*/
 // });
