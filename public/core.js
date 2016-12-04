var webServicesProject = angular.module('webServicesProject', ['ngRoute', 'angularModalService']);
webServicesProject.constant('_', window._);
webServicesProject.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider   
    .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'GroupController'    
    })  
    .when('/profile/:userId', {
        templateUrl: 'templates/account.html',
        controller: 'AccountController'        
    })  
    .when('/groups', {
        templateUrl: 'templates/groups.html',
        controller: 'GroupController'        
    })
    .when('/groups/:groupId', {
        templateUrl: 'templates/groupDetail.html',
        controller: 'GroupController'        
    })
    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
}]);