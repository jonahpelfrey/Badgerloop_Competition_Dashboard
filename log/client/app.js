var app = angular.module('logger', ['ngRoute']);

app.config(function($routeProvider) {
	'use strict';

	$routeProvider
	.when('/', {
		templateUrl: 'pages/log.html',
		controller: 'LogController'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('LogController', function($scope) {
	$scope.newCustomers = [];
	$scope.currentCustomer = {};
	$scope.joinEnable = true;
	
}); 

