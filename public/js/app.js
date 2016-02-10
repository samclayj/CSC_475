// // public/js/app.js
// var app = angular.module('sampleApp', ['ui.router', 'MainCtrl', 'ProjectCtrl', 'ExperienceCtrl', 'HomeCtrl']);
//
// //var mongoose = require('mongoose');
// //require('./models/Posts');
// //require('./models/Comments');
//
// //mongoose.connect('mongodb://localhost/news');

var routerApp = angular.module('portfolioApp', ['ui.router', 'MainCtrl']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '../views/main.html',
            controller: 'MainController'
        });

});
