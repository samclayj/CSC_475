// public/js/appRoutes.js

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController'
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
