webServicesProject.controller('GroupController', function($scope, $http, $routeParams, Authentification, Users, Groups, ModalService) {
    $scope.auth = Authentification;

    

    if($routeParams.groupId) {
        Groups.get($routeParams.groupId, function(result) {
            $scope.group = result;
        }, function(err) {
            console.log('Cannot get the group requested');
        });
    } else {
        if(Authentification.isAuthenticated()) {
            Users.account(function(result) {
                Groups.memberOf(result._id, function(res) {
                    $scope.groups = res.data;
                }, function(err) {
                    console.log('Cannot get the groups an user is a member of');
                });
            }, function(error) {
                console.log('Cannot get the user account');
            });
        }
    }

});