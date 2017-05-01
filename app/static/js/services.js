angular.module('WishList').factory('AuthService',
  ['$q', '$timeout', '$http',//'ngstorage',
  function ($q, $timeout, $http) {//,$sessionStorage

    // create user variable
    var user = null;
    var username;
    var name;

    var tit='';
    var desc='';
    var img='';
    var opt;
    var sObj={
      tit:tit,
      desc:desc,
      img:img,
      opt:opt,
      name:name

    };
 
             
   
    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      //register: register
      getUserStatus: getUserStatus,
      secShare: secShare,
      getSecShare: getSecShare
      /*getUname: getUname,
      setUname:setUname*/
      
    });



function isLoggedIn() {
  if(user) {
    return true;
  } else {
    return false;
  }
}

function login(email, password) {

  var sessionUser;
  // create a new instance of deferred
  var deferred = $q.defer();
  
  // send a post request to the server
  $http.post('/api/user/login', {email: email, password: password})
    // handle success
    .success(function (data, status) {
      if(status === 200 && data.result && data.username && data.userID){
          
          sessionUser=({'username':data.username,'userID':data.userID,'email':email}); 
                  
          
           user = true;
           deferred.resolve();
      localStorage.setItem("sesu",JSON.stringify(sessionUser));
           
      } else {
        user = false;
        deferred.reject();
      }
    })
    // handle error
    .error(function (data) {
      user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;

}

function logout() {
  // create a new instance of deferred
  var deferred = $q.defer();

  // send a get request to the server
  $http.get('/api/user/logout')
    // handle success
    .success(function (data) {
      user = false;
      deferred.resolve(); 
      
      localStorage.removeItem('satellizer_token');
      sessionStorage.removeItem('em');
    })
    // handle error
    .error(function (data) {
      user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;

}

function getUserStatus() {
      return $http.get('/api/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
          
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }
    /*
// create a new instance of deferred
  var deferred = $q.defer();
  // send a get request to the server
  $http.get('/api/status')
  // handle success
  .success(function (data) {
    user = true;
    deferred.resolve();
  })
  // handle error
  .error(function (data) {
    user = false;
    deferred.reject();
  });
  // return promise object
  return deferred.promise;
}

*/
function secShare(title,descr,imgu,opt){
         tit=title; 
         desc=descr;
         img=imgu;
         opt=opt;

}

function getSecShare(){
  return sObj;
}

/*function getUname(){
  return name;
}

function setUname(name){
  name=name;
}
*/

}]);
