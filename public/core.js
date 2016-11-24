var webServicesProject = angular.module('webServicesProject', ['ngRoute', 'angularModalService']);

webServicesProject.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider   
    .when('/', {
        templateUrl: 'templates/home.html'       
    })  
    .when('/profile', {
        templateUrl: 'templates/account.html',
        controller: 'AccountController'        
    })
    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
}]);