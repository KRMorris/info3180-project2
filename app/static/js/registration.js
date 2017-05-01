'use strict';

angular.module('WishList.registration', ['ui.router', 'toaster','ngAnimate','satellizer'])

.config(['$stateProvider', function($stateProvider, $urlRouterProvider,toaster, $authProvider) {
  $stateProvider.state('registration',{
      url:'/api/user/registration', 
    templateUrl: '../static/registration.html',
    controller: 'SignUpCtrl',
    data: {restrictedLogin: false}
   
  });
}])
.controller('SignUpCtrl', [
            '$scope','$state', '$auth','$http','AuthService','toaster',
            function($scope,$state,$auth,$http,AuthService ,toaster,$window,$q) {
                 
                 
                 $scope.addUser = function(){
                     if(!$scope.username){
                          alert("Name required");}
                     
                     $http.post('/api/user/register',{username: $scope.username, email: $scope.email, password: $scope.password

                   })
                          
                             .success(function(data){
                              if(data.success){
                                 $state.go('login'); 
                             }
                             else{
                          //alert('errR');
                          toaster.pop({
                                  type:'error',
                                  title:'Login Error',
                                  body:data.error,
                                  timeout: 0,
                                  showCloseButton: true
                            });

                      }
                     })
                                  .error(function(error){
                                      toaster.pop({
                                          type:'error',
                                  title:'Login Error',
                                  body:error.data.error,
                                  timeout: 0,
                                  showCloseButton: true
          
          });
                          })
};
}])
.run(function ($rootScope, $state, $auth) {
  $rootScope.$on('$stateChangeStart',
    function (event, toState) {
      var requiredLogin = false;
     
      
    });
});

