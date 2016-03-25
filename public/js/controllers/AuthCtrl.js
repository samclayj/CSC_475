/*
  This is the controller for the log in and register page.
*/

angular.module('AuthCtrl', []).controller('AuthController', [
  '$scope', 
  '$state',
  'auth',
function($scope, $state, auth) {
  $scope.user = {};
  
  $scope.register = function() {
    alert("Registering: " + $scope.user.firstName + " " + $scope.user.lastName);
    auth.register($scope.user).error(function(error) {
      $scope.error = error;
    }).then(function() {
      $state.go('home');
    });
  };
  
  $scope.logIn = function() {
    auth.logIn($scope.user).error(function(error) {
      $scope.error = error;
    }).then(function() {
      $state.go('home');
    });
  };
  
}]);

