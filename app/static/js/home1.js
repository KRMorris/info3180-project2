'use strict';

angular.module('WishList.home1', ['ui.router','toaster','ngAnimate','satellizer'])

.config(['$stateProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('search',{
    url:'/api/user/wishlist/search', 
    templateUrl: '../static/home1.html',
    controller: 'home1Controller',
    data: {restrictedLogin: true}
  });
}])

.controller('home1Controller', [
    '$scope','$state', '$http', 'AuthService','toaster',
    //'$interpolateProvider',
    function($scope,$state,$http,AuthService ,toaster,$auth) {
        
        
        $scope.imgList=[];
        $scope.getimg={};
        $scope.token=localStorage.getItem("satellizer_token");
        $scope.Wldecr='';
        $scope.selectedIndex = null;
        
        
        $scope.getImg = function(){
            if(!$scope.s_url)
            {
                          alert("urlrequired");
                      }
            $http.post('/imagelist',{url:$scope.s_url})
                    .success(function(data){
                        if(data.success){
                            //log(data);
                    $scope.getimg = data.imgl;
                      toaster.pop({
                                type:'wait',
                                title:'Retrieving thumbnails from external link',
                                //body:'Error retrieving thumbnails.',
                                timeout: 30000
                                //showCloseButton: true
                            });
                        }
                        else{
                            //log(data);
                            //alert('error1');
                            toaster.pop({
                                type:'error',
                                title:'Error',
                                body:'Error retrieving thumbnails.',
                                timeout: 10000,
                                showCloseButton: true
                            });
                        }
                    
                        })
                                .error(function(data){
                                    //log(data);
                                            //alert('error');
                                toaster.pop({
                                type:'error',
                                title:'Server Error',
                                body:'Error retrieving thumbnails.',
                                timeout: 10000,
                                showCloseButton: true
                            });
                        
            });
        };
        
        $scope.tTitle = function(){
            $http.post('/api/title',{url:$scope.s_url})
                    .success(function(data){
                        if(data.title){
                            $scope.t_title=data.title;
                        }
                        else{
                            //alert('Error retrieving title.  Try again or manually enter title');
                            toaster.pop({
                                type:'warning',
                                title:'Thumbnail title error',
                                body:'Error retrieving title. Try again or manually enter title.',
                                timeout: 0,
                                showCloseButton: true
                            });
                        }
            })
                    .error(function(data){
                        //alert('Error retrieving title. Try again or manually enter title');
                        toaster.pop({
                                type:'error',
                                title:'Thumbnail title error',
                                body:'Error retrieving title. Try again or manually enter title.',
                                timeout: 10000,
                                showCloseButton: true
                            });
                        });
            }//);
        
        
        $scope.setUrl= function(imgUrl) {
	       $scope.selImg = imgUrl;
               
        };
  
       
        $scope.imgClicked = function ($index) {
            //console.log($index);
            $scope.selectedIndex = $index;
        };
        $scope.showBt=true;
        $scope.toggle = function() {
            $scope.showBt = false;
        };
        
        $scope.saveWishL= function(){
           
            if(!$scope.selImg && !$scope.Wldecr && !$scope.t_title){
                          alert("required");}
            $http.post('/api/user/'+$scope.token+'/wishlist',{'title':$scope.t_title,'description':$scope.Wldecr,'thumbUrl':$scope.selImg,'url':$scope.s_url})
            
                    .success(function(data){
                        if(data.success){
                            toaster.pop({
                                type:'success',
                                title:'Success',
                                body:'Wish successfully added to WishList',
                                timeout: 10000,
                                showCloseButton: true
                            });
                           
       
                        }
                else{
                    //alert('Er');
                    toaster.pop({
                                type:'warning',
                                title:'WishList',
                                body:'Unable to save wish to WishList, please try again.',
                                timeout: 10000,
                                showCloseButton: true
                            });
                }
                        //$scope.
                        
            })
            .error(function(data){
                toaster.pop({
                                type:'error',
                                title:'WishList',
                                body:'Unable to save wish to WishList, please try again.',
                                timeout: 10000,
                                showCloseButton: true
                            });
                })
                
                        //alert('error');
                                  
        
        
    };
   // };
       $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });

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

