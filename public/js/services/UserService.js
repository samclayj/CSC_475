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
  
  /*Get a user with a specific id.*/
  o.get = function(id) {
    return $http.get('/api/users/' + id).then(function(res) {
      return res.data;  
    });
  };
  
  o.deleteUser = function(id) {
    return $http.post('/api/users/delete/' + id).success(function(data) {
      
    });
  };
  
  o.updateUser = function(updatedUser) {
    return $http.post('/api/users/update/' + updatedUser._id, updatedUser).success(function(data) {

    });
  };
  
  return o;
  
}]);

