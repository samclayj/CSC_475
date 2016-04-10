/*
  This is the controller for the log in and register page.
*/

angular.module('AuthCtrl', []).controller('AuthController', [
  '$scope', 
  '$rootScope',
  '$state',
  'auth',
function($scope, $rootScope, $state, auth) {
  $scope.user = {};
  
  $scope.submitUserData = function() {
    auth.register($scope.user).error(function(error) {
      $scope.error = error;
    }).then(function() {
      $rootScope.$emit('linkRefreshEvent', null);
      $state.go('home');
    });
  };
  
  $scope.logIn = function() {
    auth.logIn($scope.user).error(function(error) {
      $scope.error = error;
    }).then(function() {
      $rootScope.$emit('linkRefreshEvent', null);
      $state.go('home');
    });
  };
  
}]);

