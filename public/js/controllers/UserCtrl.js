// public/js/controllers/MainCtrl.js
angular.module('UserCtrl', []).controller('UserController', [
  '$scope',
  'auth',
  '$state',
  'userService',
  'currentUser',
  function($scope, auth, $state, userService, currentUser, ngDialog) {
    //Authentication from auth controller
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.state = $state;


    $scope.allUsers = userService.allUsers;
    
    $scope.editUser = function (id) {
     $state.go('editUser', { "id": id});
    };
    
    $scope.deleteUser = function (id) {
      userService.deleteUser(id);
      userService.getAll();
      $state.go($state.current, {}, {reload: true});
    };
    
    $scope.backToUserManage = function () {
     $state.go('manageUsers');
    };
    
    //=========================HANDLE USER EDITING=========================//
    //Current user will be null unless a user is being edited.
    $scope.editingUser = currentUser != null;
   
    if($scope.editingUser) {
      $scope.user = angular.copy(currentUser);
      $scope.user.password = null;
    }

    $scope.submitUserData = function() {
      userService.updateUser($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
         //User uodated successfully.
      });
  };
    
}]);

