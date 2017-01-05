var app = angular.module('logger', ['ngRoute', 'ngResource']);

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

app.controller('LogController', function($scope, $http, msgService, socket) {
	
	$scope.messages = msgService.query();

	socket.on('new-entry', function() {
		$scope.messages = msgService.query();
	});
}); 

app.factory('msgService', function($resource) {
	return $resource('logger/messages', {});
});

app.factory('socket', function($rootScope) {
	var socket = io.connect();

	return {
		on: function(eventName, callback) {
			socket.on(eventName, callback);
		},
		emit: function(eventName, data) {
			socket.emit(eventName, data);
		}
	}
});
