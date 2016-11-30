var webServicesProject = angular.module('webServicesProject', ['ngRoute', 'angularModalService']);

webServicesProject.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider   
    .when('/', {
        templateUrl: 'templates/home.html'       
    })  
    .when('/profile/:userId', {
        templateUrl: 'templates/account.html',
        controller: 'AccountController'        
    })  
    .when('/community', {
        templateUrl: 'templates/groups.html',
        controller: 'GroupController'        
    })
    .when('/community/:groupId', {
        templateUrl: 'templates/groupDetail.html',
        controller: 'GroupController'        
    })
    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
}]);