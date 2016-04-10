angular.module('ObjectiveService', []).factory('objectiveService', ['$http', 'auth', function($http, auth) {

  var o = {
    allObjectives:[]
  };
  
  /*Using the angular $http service to query our posts route. The succsess() function
    allows us to bind a function that will be executed when the request returns.*/
  o.getAll = function() {
    
    return $http.get('/api/objectives').success(function(data) {
       //Use angular copy to ensure that a deep copy of the returned data is made.
       angular.copy(data, o.allObjectives);                             
    });
    
  };
  
  /*Use the http post method to create the api URL necessary to create a new objective*/
  o.create = function(objective) {
    return $http.post('/api/objectives', objective, {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    }).success(function(data) {
      console.log(data);
      o.allObjectives.push(data);
    });
  }
  
  /*Get a objective with a specific id.*/
  o.get = function(id) {
    return $http.get('/api/objectives/' + id).then(function(res) {
      return res.data;  
    });
  };
  
  o.deleteObjective = function(id) {
    return $http.post('/api/objectives/delete/' + id).success(function(data) {
    });
  };
  
  o.updateObjective = function(updatedObjective) {
    return $http.post('/api/objectives/update/' + updatedObjective._id, updatedObjective).success(function(data) {
    });
  };
  
  o.addOutcome = function(id, outcome) {
    return $http.post('/api/objectives/' + id + '/outcomes', outcome, {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    });
  }
  
  o.deleteOutcome = function(id) {
     return $http.post('/api/outcomes/delete/' + id).success(function(data) {
     });
  }
  
  return o;
  
}]);


