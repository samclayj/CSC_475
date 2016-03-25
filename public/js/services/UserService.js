angular.module('UserService', []).factory('userService', ['$http', 'auth', function($http, auth) {

  var o = {
    allUsers:[]
  };
  
  /*Using the angular $http service to query our posts route. The succsess() function
    allows us to bind a function that will be executed when the request returns.*/
  o.getAll = function() {
    
    return $http.get('/api/users').success(function(data) {
       //Use angular copy to ensure that a deep copy of the returned data is made.
       angular.copy(data, o.allUsers);                             
    });
    
  }
  
  return o;
  
}]);

