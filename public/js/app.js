var creditSystem = angular.module('creditSystem', ['ui.router', 'MainCtrl', 'PostsCtrl', 'PostService', 'AuthCtrl', 'AuthService', 'NavCtrl', 'UserService', 'UserCtrl']);

creditSystem.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    
  
    /*The resolve attribute calls the method in PostService.js
      to populate the posts from the database using API calls*/
  
    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '../views/main.html',
            controller: 'MainController',
            resolve: {
              postPromise: ['posts', function(posts) {
                return posts.getAll();
              }]
            }
        })
    
    //Now the angular ui-router will detect when we are entering the posts state
    //and will query the server for the full post object, including comments.
    //Now to get access to this post object in PostsCtrl, we will use the post object that
    //will be directly injected into the controller (instead of the posts service directly).
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '../views/posts.html',
            controller: 'PostsController',
            resolve: {
              post: ['$stateParams', 'posts', function($stateParams, posts) {
                return posts.get($stateParams.id);
              }]
            }
        })
    
        //OnEnter is used for both of these states to detect if a user is authenticated
        //before entering the state. Redirect home if they are already logged in.
        .state('login', {
            url:'/login',
            templateUrl: '../views/login.html',
            controller: 'AuthController',
            onEnter: ['$state', 'auth', function($state, auth) {
              if(auth.isLoggedIn()) {
                $state.go('home');
              }
            }]
        })
    
        .state('register', {
            url: '/register',
            templateUrl: '../views/register.html',
            controller: 'AuthController',
            onEnter: ['$state', 'auth', function($state, auth) {
              if(auth.isLoggedIn()) {
                $state.go('home');
              }
            }]
        })
    
         .state('manageUsers', {
          url: '/manageUsers',
          templateUrl: '../views/manageUsers.html',
          controller: 'UserController',
          resolve: {
              postPromise: ['userService', function(userService) {
                return userService.getAll();
              }]
           }
        });

});
