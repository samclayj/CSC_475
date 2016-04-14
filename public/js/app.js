var creditSystem = angular.module('creditSystem', ['ui.router', 'ngAnimate', 'MainCtrl', 
                                                   'PostsCtrl', 'PostService', 
                                                   'AuthCtrl', 'AuthService', 'NavCtrl', 
                                                   'UserService', 'UserCtrl',
                                                   'ObjectiveService', 'ObjectiveCtrl']);

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
            templateUrl: '../views/users/login.html',
            controller: 'AuthController',
            onEnter: ['$state', 'auth',  function($state, auth) {
              if(auth.isLoggedIn()) {
                $state.go('home');
              }
            }]
        })
    
        .state('register', {
            url: '/register',
            templateUrl: '../views/users/registerUser.html',
            controller: 'AuthController',
            onEnter: ['$state', 'auth', function($state, auth) {
              if(auth.isLoggedIn()) {
                $state.go('home');
              }
            }]
        })
    
         .state('manageUsers', {
          url: '/manageUsers',
          templateUrl: '../views/users/manageUsers.html',
          controller: 'UserController',
          resolve: {
              postPromise: ['userService', function(userService) {
                return userService.getAll();
              }],
              currentUser: ['$stateParams', 'userService', function($stateParams, userService) {
                return null;
              }]
           }
        }) 
    
        .state('editUser', {
          url: '/editUser/{id}',
          templateUrl: '../views/users/editUser.html',
          controller: 'UserController',
          resolve: {
              currentUser: ['$stateParams', 'userService', function($stateParams, userService) {
                return userService.get($stateParams.id);
              }]
           }
        })

       .state('manageObjectives', {
          url: '/manageObjectives',
          templateUrl: '../views/objectives/manageObjectives.html',
          controller: 'ObjectiveController',
          resolve: {
              postPromise: ['objectiveService', function(objectiveService) {
                return objectiveService.getAll();
              }],
              currentObjective: ['$stateParams', 'objectiveService', function($stateParams, objectiveService) {
                return null;
              }]
           }
        })
    
      .state('addObjective', {
          url: '/addObjective',
          templateUrl: '../views/objectives/addObjective.html',
          controller: 'ObjectiveController',
          resolve: {
              postPromise: ['objectiveService', function(objectiveService) {
                return objectiveService.getAll();
              }],
              currentObjective: ['$stateParams', 'objectiveService', function($stateParams, objectiveService) {
                return null;
              }]
           }
        })
    
       .state('editObjective', {
          url: '/editObjective/{id}',
          templateUrl: '../views/objectives/editObjective.html',
          controller: 'ObjectiveController',
          resolve: {
              currentObjective: ['$stateParams', 'objectiveService', function($stateParams, objectiveService) {
                return objectiveService.get($stateParams.id);
              }]
           }
        })
    
       .state('manageObjectiveOutcomes', {
          url: '/manageObjectiveOutcomes/{id}',
          templateUrl: '../views/objectives/objectiveOutcomes.html',
          controller: 'ObjectiveController',
          resolve: {
              currentObjective: ['$stateParams', 'objectiveService', function($stateParams, objectiveService) {
                return objectiveService.get($stateParams.id);
              }]
           }
        });
});

//Upgrade DOM elements so they are supported by MDL when added.
//This is required for dynamic web applications
creditSystem.run(function () {
    var mdlUpgradeDom = false;
    setInterval(function() {
      if (mdlUpgradeDom) {
        componentHandler.upgradeDom();
        mdlUpgradeDom = false;
      }
    }, 200);

    var observer = new MutationObserver(function () {
      mdlUpgradeDom = true;
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    /* support <= IE 10
    angular.element(document).bind('DOMNodeInserted', function(e) {
        mdlUpgradeDom = true;
    });
    */
});
