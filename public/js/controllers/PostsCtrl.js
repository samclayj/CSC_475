// public/js/controllers/MainCtrl.js
angular.module('PostsCtrl', []).controller('PostsController', [
  '$scope',
  'auth',
  'posts',
  'post',
  function($scope, auth, posts, post) {
    //Authentication from auth controller
    $scope.isLoggedIn = auth.isLoggedIn;
    
    $scope.tagline = 'To the moon and back again!';
    //Get the post with the right id (provided in the URL)
    $scope.post = post;
    
    alert(post.author);
    
    $scope.addComment = function() {
      if($scope.body === '') {
        return;
      }
      
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user'
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
    
    $scope.incrementUpvotes = function(comment) {
      posts.upvoteComment(post, comment);
    }
}]);
