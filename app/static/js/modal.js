angular.module('WishList.userWishList')
        .controller('ModalInstanceCtrl',function($scope, $uibModalInstance){
        
                    $scope.send = function(){
                        
                        $uibModalInstance.close();
                 };   
                    
                    $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                
        });
