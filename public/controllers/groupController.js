webServicesProject.controller('GroupController', function($scope, $http, $routeParams, Authentification, Users, Groups, ModalService) {
    $scope.auth = Authentification;
    $scope.isMemberOf = false;
    $scope.group = {};
    $scope.groups = [];

    if(Authentification.isAuthenticated()) {
        
    }

    $scope.joinGroup = function(groupId) {
        if(Authentification.isAuthenticated()) {
            Users.account(function(res) {
                Groups.join(groupId, res.data._id, function(res) {
                    $scope.isMemberOf = true;
                }, function(err) {
                    console.log('Cannot add user to the group');
                });
            });
        }
    };

    if($routeParams.groupId) {
        Groups.get($routeParams.groupId, function(res) {
            $scope.group = res.data;
        }, function(err) {
            console.log('Cannot get the group requested');
        });
        Users.account(function(res) {
            if($scope.group.members.indexOf(res.data._id) > -1) {
                $scope.isMemberOf = true;
            }
        });
    } else {
        if(Authentification.isAuthenticated()) {
            Users.account(function(user) {
                Groups.getAll(function(groups) {
                    Groups.memberOf(user.data._id, function(res) {
                        $scope.interestingGroups = _.differenceWith(groups.data, res.data, _.isEqual);
                    }, function(err) {
                        console.log('Cannot get the groups an user is a member of');
                    });
                }, function(err) {
                    console.log('Cannot get the groups an user is a member of');
                });
            }, function(error) {
                console.log('Cannot get the user account');
            });
        }
    }

});