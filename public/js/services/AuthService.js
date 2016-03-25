//This will use localStorage for persisting data to the client.
//If a JWT token exists in localStorage, we can assume the user
//is logged in as long as the token isn't expired.

//Log a user out by removing the token from local storage.
//$window is used for interfacing with localStorage

angular.module('AuthService', []).factory('auth', ['$http', '$window', function($http, $window) {
  var auth = {};
  
  //Save JWT token to local storage.
  auth.saveToken = function(token) {
    $window.localStorage['credit-user-system-token'] = token;
  };
  
  //Return the JWT token to the caller that is stored in local storage.
  auth.getToken = function() {
    return $window.localStorage['credit-user-system-token'];
  };
  
  //Return a boolean value indicating whether or not a user is logged in.
  auth.isLoggedIn = function() {
    var token = auth.getToken();
    
    if(token) {
      //Token exists. See if it has expired.
      //The payload is the middle part of the token between the two .'s.
      //It is a JSON object that has been serialized. Get it back to a stringified
      //JSON object by using $window.atob(), and then back to a Javascript object with
      //JSON.parse.
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  
  //Return the username of the user that is currently logged in.
  auth.currentUser = function() {
    if(auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      console.log("Current User: " + payload);
      return payload.username;
    }
  };
  
  auth.accountType = function() {
    if(auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      console.log("Account Type: " + payload);
      return payload.accountType;
    }
  }
  
  // Register, Log in, Log out======================================================
  
  //Register a new user (use API call).
  auth.register = function(user) {
    return $http.post('/api/register', user).success(function(data) {
      //Save the newly created token
      auth.saveToken(data.token);
    });
  };
  
  //Log in a user (use API call).
  auth.logIn = function(user) {
    return $http.post('/api/login', user).success(function(data) {
      //Save the newly created token
      auth.saveToken(data.token);
    });
  }
  
  //Logout a user. Delete the token from localStorage
  auth.logOut = function() {
    $window.localStorage.removeItem('credit-user-system-token');
  }
  
  return auth;
}]);