var routerApp = angular.module('portfolioApp', ['ui.router', 'MainCtrl', 'ProjectCtrl', 'ExpCtrl']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '../views/main.html',
            controller: 'MainController'
        })

        .state('projects', {
            url: '/projects',
            templateUrl: '../views/projects.html',
            controller: 'ProjectController'
        })
  
        .state('experience', {
              url: '/experience',
              templateUrl: '../views/experience.html',
              controller: 'ExpController'
          });

});
