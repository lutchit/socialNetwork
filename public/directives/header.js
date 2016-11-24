webServicesProject.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        controller: 'AccountController',
        templateUrl: "../templates/header.html"
    };
});