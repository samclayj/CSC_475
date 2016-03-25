// public/js/controllers/MainCtrl.js
angular.module('UserCtrl', []).controller('UserController', [
  '$scope',
  'auth',
  'userService',
  function($scope, auth, userService) {
    //Authentication from auth controller
    $scope.isLoggedIn = auth.isLoggedIn;
    
    $scope.tagline = 'To the moon and back again!';

    $scope.allUsers = userService.allUsers;
    
}]);

