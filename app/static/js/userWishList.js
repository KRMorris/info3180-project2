'use strict';

angular.module('WishList.userWishList', ['ui.router','toaster','ngAnimate','satellizer','ui.bootstrap','720kb.socialshare' ])

.config(['$stateProvider', function($stateProvider) {
        
  $stateProvider.state('mywishlist', {
      url:'/api/user/mywishlist',
    templateUrl: '../static/userWishList.html',
    controller: 'userWLCtrl',
    data: {restrictedLogin: true}
  });
}])


.controller('userWLCtrl',
  ['$scope', '$state', '$http','$location', 'AuthService','toaster','$uibModal','$auth','$timeout',
  function ($scope, $state,$http,$location, AuthService,toaster,$uibModal,$auth,$timeout) {
      
    $scope.load= function(){
             $scope.isCollapsed = true;
              $scope.rate=0;
              $scope.max = 5;
              $scope.lv="Low priority";
              $scope.token=localStorage.getItem("satellizer_token");
          $http.get('api/user/'+$scope.token+'/wishlist')
          //$http.get('api/userinfo')
                  .success(function(data){
                      if(data.success){
                          $scope.username=data.username;
                          
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
            $scope.logout = function () {

      // call logout from service
        AuthService.logout()
        .then(function () {
          $state.go('login');
        });

    };
    
    $scope.share = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl:'../static/modal.html',
            controller:'ModalInstanceCtrl'
        });
    };
     $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
    if(value==4 | value==5){
      $scope.lv="High priority";
      //return $scope.lv;
    }
      else if(value==3){
        $scope.lv='Medium priority';
      //return $scope.lv;
      }
      else if(value==2| value==1){
        $scope.lv='Low priority';
     // return $scope.lv;
      }
    
  };

  $scope.setShUrl= function(tit,des,imgUrl,opt) {
         $scope.selShImg = imgUrl;
         $scope.tit=tit;
         $scope.des=des;
         AuthService.secShare($scope.tit,$scope.des,$scope.selShImg);
         $scope.objectValue=AuthService.getSecShare();
         $scope.objectValue.name=$scope.username;
         if(opt==1 || tit != ' '){
         $scope.objectValue.img=imgUrl;
         $scope.objectValue.tit=tit;
         $scope.objectValue.desc=des;
         $scope.objectValue.opt=opt;
         
          
         }
         else{
          $scope.objectValue.img='';
         $scope.objectValue.tit='';
         $scope.objectValue.desc='';
         $scope.objectValue.opt=opt;

         }
            
        };
  

  $scope.remove = function(urldel){
          var urldel=urldel;

          $http.post('/api/user/'+$scope.token+'/remove', {"urldel": urldel}).
          success(function(results) {
          //$location.path('/api/user/:id/wishlist'); //api/user/mywishlist
          //$log.log(results);
          toaster.pop({
                                type:'wait',
                                title:'Item deleted successfully',
                                //body:'Error retrieving thumbnails.',
                                timeout: 3000
                                //showCloseButton: true
                            });
      }).
      error(function(error) {
        toaster.pop({
                                type:'error',
                                title:'Error',
                                body:'Error deleting item.',
                                timeout: 10000,
                                showCloseButton: true
                            });
        //$log.log(error);
      });
  
};
  
  $scope.shareModal = function(){
      var modalInstance1 = $uibModal.open({
            animation: true,
            templateUrl:'../static/modal1.html',
            controller:'ModalInstanceCtrl1'
        });
     // var sDeets=thumb;
     // $scope.subjectModal=sDeets;
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

angular.module('WishList.userWishList')
        .controller('ModalInstanceCtrl',['$scope', '$location','AuthService','$uibModalInstance','$http','toaster',
    function($scope, $location, AuthService, $uibModalInstance,$http,toaster){
        var myobj=sessionStorage.getItem('em');
        
         $scope.showthumb=true;
       
            $scope.token=localStorage.getItem("satellizer_token");
            $scope.passwordModal='';
          
          
           $scope.flname=AuthService.getSecShare().name

           
           if(AuthService.getSecShare().tit==''|| AuthService.getSecShare().desc=='' || AuthService.getSecShare().img=='' || AuthService.getSecShare().opt==0){
            
            /*console.log('token show');
            console.log(AuthService.getSecShare().desc);*/
            var t=$scope.token
            var v=t.split('"');
            
            $scope.messageModal=$location.host()+'/#/api/user/'+v[1]+'/sharedwishlist';

           }
           else{
            $scope.messageModal=AuthService.getSecShare().tit+"\n"+AuthService.getSecShare().desc+"\n"+AuthService.getSecShare().img;
            //console.log('No token');
           }

         
                    
                    $scope.getEmail = myobj;
                    $scope.send = function(){
                        $http.post('/api/user/share/email',{'recp':$scope.toModal,'subject':$scope.subjectModal,'username':$scope.flname,'message':$scope.messageModal})
                        .success(function(data){
                        if(data.success){
                            //log(data);
                    //$scope.getimg = data.imgl;
                      toaster.pop({
                                type:'wait',
                                title:'Message sent',
                                //body:'Error retrieving thumbnails.',
                                timeout: 3000
                                //showCloseButton: true
                            });
                            $uibModalInstance.close();
                        }
                        else{
                            toaster.pop({
                                type:'error',
                                title:'Error',
                                body:'Error sending message.',
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
                                body:'Error sending message.',
                                timeout: 10000,
                                showCloseButton: true
                            });
                        
            });
        
                        
                 };   
                    
                    $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                
       
        $scope.toggle = function() {
            $scope.showthumb = false;
        };

        
        
                
        }]);
        
 angular.module('WishList.userWishList')
        .controller('ModalInstanceCtrl1',function($scope, $uibModalInstance,$uibModal){
        
                    $scope.send = function(){
                        
                        $uibModalInstance.close();
                 };   
                    
                    $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
           
        
                 $scope.share = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl:'../static/modal.html',
            controller:'ModalInstanceCtrl'
        });
    };  
        });


