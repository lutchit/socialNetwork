webServicesProject.controller('GroupController', function($scope, $http, $routeParams, Authentification, Users, Groups, ModalService) {
    $scope.auth = Authentification;
    $scope.isMemberOf = false;
    $scope.isAdmin = false;
    $scope.isUpdating = false;
    $scope.group = {};
    $scope.groups = [];
    $scope.interestingGroups = [];
    $scope.newGroup = {};
    $scope.newComment = {};
    $scope.colors = ['blue', 'green', 'red', 'yellow', 'pink', 'purple', 'brown', 'orange', 'grey'];

    $scope.go = function(path) {
        window.location = path;
    };

    $scope.joinGroup = function(groupId) {
        if(Authentification.isAuthenticated()) {
            Users.account(function(res) {
                Groups.join(groupId, res.data._id, function(res1) {
                    $scope.isMemberOf = true;
                    _.remove($scope.interestingGroups, { _id : groupId});
                    $scope.group.members.push(res.data);
                }, function(err) {
                    console.log('Cannot add user to the group');
                });
            });
        }
    };

    $scope.showGroupForm = function() {
        ModalService.showModal({
            templateUrl: 'templates/createGroupModal.html',
            controller: 'modalCreateGroupController'
        }).then(function(modal) {
            modal.close.then(function() {
                
            });
        });
    };

    $scope.addComment = function(groupId) {
        Users.account(function(res) {
            Groups.addComment(groupId, res.data._id, $scope.newComment.message, function(res) {
                $scope.group.dashboard.push(res.data);
            }, function(err) {
                console.log('Cannot add a comment to the group');
            });
        });
    };

    $scope.startUpdate = function() {
        $scope.isUpdating = true;
    };

    $scope.saveUpdate = function() {
        Groups.modify($scope.newGroup, function(result) {
            $scope.isUpdating = false;
        }, function(err) {
            console.log('Cannot update the user');
        });
    };

    $scope.deleteGroup = function() {
        Groups.remove($scope.group._id, function() {
            window.location = '/';
        }, function(err) {
            console.log('Cannot remove the group');
        });
    };

    $scope.deleteMember = function(userId) {
        Groups.removeMember($scope.group._id, userId, function() {
            _.remove($scope.group.members, { _id : userId});
        }, function(err) {
            console.log('Cannot remove the user from the group');
        });
    };

    $scope.quitGroup = function(userId) {
        Users.account(function(res) {
            Groups.removeMember($scope.group._id, res.data._id, function() {
                _.remove($scope.group.members, { _id : res.data._id});
                $scope.isMemberOf = false;
            }, function(err) {
                console.log('Cannot remove the user from the group');
            });     
        });
    };

    $scope.showDate = function(date, numberToRemove) {
        return new Date(date).toUTCString().slice(0, new Date(date).toUTCString().length - numberToRemove);
    };

    if($routeParams.groupId) {
        Groups.get($routeParams.groupId, function(res) {
            $scope.group = res.data;
            $scope.newGroup = res.data;
            Users.account(function(res) {
                if($scope.group.admin === res.data._id) {
                    $scope.isAdmin = true;
                    $scope.isMemberOf = true;
                } else if(_.findIndex($scope.group.members, { '_id': res.data._id }) > -1) {
                    $scope.isMemberOf = true;
                }
            });
        }, function(err) {
            console.log('Cannot get the group requested');
        });
    } else {
        Groups.getAll(function(groups) {
            $scope.groups = groups.data;
            _.each($scope.groups, function(group) {
                group.color = $scope.colors[Math.floor(Math.random() * ($scope.colors.length))];
            });
            if(Authentification.isAuthenticated()) {
                Users.account(function(user) {
                    Groups.getAllDetailed(function(detailedGroups) {
                        Groups.memberOf(user.data._id, function(res) {
                            $scope.interestingGroups = _.differenceWith(detailedGroups.data, res.data, _.isEqual);
                        }, function(err) {
                            console.log('Cannot get the groups an user is a member of');
                        });
                    }, function(err) {
                        console.log('Cannot get the detailed groups');
                    });
                }, function(error) {
                    console.log('Cannot get the user account');
                });
            }
        }, function(err) {
            console.log('Cannot get the groups an user is a member of');
        });
    }

});

webServicesProject.controller('modalCreateGroupController', function($scope, close, Users, Groups, Authentification) {
    $scope.close = close;

    $scope.newGroup = {};

    $scope.create = function() {

        if($scope.newGroup.name === '') {
            alert('Name is required !');
            return;
        }

        Users.account(function(res) {
            var groupToCreate = {
                idAdmin : res.data._id,
                name: $scope.newGroup.name,
                description: $scope.newGroup.description
            };
            Groups.create(groupToCreate, function(res) {
                window.location = '/groups/' + res.data._id;
            }, function(err) {
                console.log('Cannot create the group');
            });
        });
    };
});