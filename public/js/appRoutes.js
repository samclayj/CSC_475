// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController'
        })

        // nerds page that will use the NerdController
        .when('/nerds', {
            templateUrl: 'views/nerd.html',
            controller: 'NerdController'
        })

        .when('/Projects', {
            templateUrl: 'views/projects.html',
            controller: 'ProjectController'
        })

        .when('/Experience', {
            templateUrl: 'views/experience.html',
            controller: 'ExperienceController'
        })
        ;

    $locationProvider.html5Mode(true);

}]);
