'use strict';

angular.module('WishList.sharedWishList', ['ui.router','toaster','ngAnimate','satellizer','ui.bootstrap','720kb.socialshare' ])

.config(['$stateProvider', function($stateProvider) {
        
  $stateProvider.state('sharedwishlist', {
      url:'/api/user/{token}/sharedwishlist',
    templateUrl: '../static/sharedWL.html',
    controller: 'userWLCtrl',
    data: {restrictedLogin: true}
  });
}])


.controller('sharedWLCtrl',
  ['$scope', '$state', '$http','$location', 'AuthService','toaster','$uibModal','$auth','$timeout','$stateParams',
  function ($scope, $state,$http,$location, AuthService,toaster,$uibModal,$auth,$timeout,$stateParams) {

  	$scope.load= function(){
        
             $scope.isCollapsed = true;
              $scope.rate=0;
              $scope.max = 5;
              $scope.lv="Low priority";
              $scope.token=localStorage.getItem("satellizer_token");
          $http.get('api/user/'+$stateParams.token+'/sharedwishlist')
        
                  .success(function(data){
                      if(data.success){
                          $scope.username=data.username;
                          $scope.user=data.uid;
                          console.log(data.uid);
                          sessionStorage.setItem("em",data.email);
                           toaster.pop({
                                type:'wait',
                                title:'Retrieving WishList',
                                //body:'Error retrieving thumbnails.',
                                timeout: 3000
                                //showCloseButton: true
                            });
                          $scope.wishes=data.wishes;
                          
                      }
                      else{
                          //alert('errR');
                          toaster.pop({
                                type:'error',
                                title:'Error Retrieving WishList',
                                //body:'Error retrieving thumbnails.',
                                timeout: 3000
                                //showCloseButton: true
                            });
                      }
          })
                  .error(function(data){
                      //alert('error2');
                    toaster.pop({
                                type:'error',
                                title:'Error',
                                body:'Error Retrieving WishList. Please login and try again',
                                timeout: 3000
                                //showCloseButton: true
                            });
                            
                           $state.go('login');
          });
     // })
      };
         


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