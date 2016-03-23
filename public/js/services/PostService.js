angular.module('PostService', []).factory('posts', ['$http', 'auth', function($http, auth) {

  var o = {
    posts:[]
  };
  
  /*Using the angular $http service to query our posts route. The succsess() function
    allows us to bind a function that will be executed when the request returns.*/
  o.getAll = function() {
    
    return $http.get('/api/posts').success(function(data) {
       //Use angular copy to ensure that a deep copy of the returned data is made.
       angular.copy(data, o.posts);                             
    });
    
  }
  
  /*Use the http post method to create the api URL necessary to create a new post*/
  o.create = function(post) {
    return $http.post('/api/posts', post, {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    }).success(function(data) {
      console.log(data);
      o.posts.push(data);
    });
  }
  
  /*Use the http put method to upvote the post with the specified ID. Notice
    that the URL is being formatted as a string to match the correct API call*/
  o.upvote = function(post) {
    return $http.put('/api/posts/' + post._id + '/upvote', null, {
      headers: {Authorizaton: 'Bearer ' + auth.getToken()}
    }).success(function(data) {
      post.upvotes +=1;  
    });
  };
  
  /*Get a post with a specific id.*/
  o.get = function(id) {
    return $http.get('/api/posts/' + id).then(function(res) {
      return res.data;  
    });
  };
  
  o.addComment = function(id, comment) {
    return $http.post('/api/posts/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    });
  }
  
  o.upvoteComment = function(post, comment) {
    return $http.put('/api/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    }).success(function(data) {
      comment.upvotes += 1;
    });
  }
  
  return o;
  
}]);
