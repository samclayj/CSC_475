// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', [
  '$scope',
  'auth',
  'posts', 
  function($scope, auth, posts) {
    
    //Authentication from auth controller
    $scope.isLoggedIn = auth.isLoggedIn;
    
    $scope.test = 'To the moon and back again!';
    $scope.posts = posts.posts;
    
    $scope.addPost = function() {
      if(!$scope.title || $scope.title === '') { return; }
      
      posts.create({
        title: $scope.title,
        link: $scope.link
      });
      $scope.title = '';
      $scope.link = '';
    };
  
    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };
  
}]);
