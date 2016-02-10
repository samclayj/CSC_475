// public/js/app.js
var app = angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'ProjectCtrl', 'ExperienceCtrl']);

var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');

mongoose.connect('mongodb://localhost/news');
