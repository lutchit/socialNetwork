webServicesProject.controller('AccountController', function($scope, $http, $routeParams, Authentification, Users, Groups, ModalService) {
    $scope.auth = Authentification;
    $scope.close = close;
    $scope.isUpdating = false;
    $scope.user = {};
    $scope.newUser = {};

    if($routeParams.userId) {
        if($routeParams.userId === 'me') {
            $scope.isMe = true;
        } else {
            $scope.isMe = false;
            Users.get($routeParams.userId, function(user) {
                $scope.otherUser = user.data;
                Groups.memberOf($scope.otherUser._id, function(res) {
                    $scope.otherUserGroups = res.data;
                }, function(err) {
                    console.log('Cannot get the groups an user is a member of');
                });
            }, function(err) {
                console.log('Cannot get the user :' + $routeParams.userId);
                window.location = '/profile/me';
            });
        }
    }

    if(Authentification.isAuthenticated()) {
        Users.account(function(res) {
            if($routeParams.userId) {
                if($routeParams.userId === res.data._id) {
                    $scope.isMe = true;
                }
            }
            $scope.user = res.data;
            $scope.newUser = res.data;
            Groups.memberOf($scope.user._id, function(res) {
                $scope.groups = res.data;
            }, function(err) {
                console.log('Cannot get the groups an user is a member of');
            });
        }, function(error) {
            console.log('Cannot get the user account');
        });
    }

    $scope.startUpdate = function() {
        $scope.isUpdating = true;
    };

    $scope.saveUpdate = function() {
        Users.modify($scope.newUser, function(result) {
            $scope.isUpdating = false;
        }, function(err) {
            console.log('Cannot update the user');
        });
    };

    $scope.deleteAccount = function() {
        Authentification.remove($scope.user, function() {
            $scope.user = {};
        }, function(err) {
            console.log('Cannot remove the user');
        });
    };

    $scope.showDate = function(date, numberToRemove) {
        return new Date(date).toUTCString().slice(0, new Date(date).toUTCString().length - numberToRemove);
    };

    $scope.showSigninForm = function() {
        ModalService.showModal({
            templateUrl: 'templates/signinModal.html',
            controller: 'modalSigninController'
        }).then(function(modal) {
            modal.close.then(function() {
                
            });
        });
    };

    $scope.showLoginForm = function() {
        ModalService.showModal({
            templateUrl: 'templates/loginModal.html',
            controller: 'modalLoginController'
        }).then(function(modal) {
            modal.close.then(function() {
                
            });
        });
    };

    $scope.showLogout = function() {
        ModalService.showModal({
            templateUrl: 'templates/logoutModal.html',
            controller: 'modalLogoutController'
        }).then(function(modal) {
            modal.close.then(function() {

            });
        });
    };

});

webServicesProject.controller('modalSigninController', function($scope, close, Users, Authentification) {
    $scope.close = close;

    $scope.newUser = {
        email:'',
        password:'',
        password2: '',
        firstname: '',
        lastname: '',
        biography: ''
    };

    $scope.signin = function() {

        var formData = {
            email: $scope.newUser.email,
            password: $scope.newUser.password,
            firstname: $scope.newUser.firstname,
            lastname: $scope.newUser.lastname,
            biography: $scope.newUser.biography
        };

        if($scope.newUser.email === '' || $scope.newUser.password === '' || $scope.newUser.firstname === '' || $scope.newUser.lastname === '') {
            alert('Email, password and name required !');
            return;
        }
        Authentification.register(formData, function(res) {
            window.location = '/profile/me';
        }, function(err) {
            alert(err);
            window.location = '/';
        });
    };
});

webServicesProject.controller('modalLoginController', function($scope, close, Users, Authentification) {
    $scope.close = close;

    $scope.loginForm = {
        email:'',
        password:''
    };

    $scope.login = function() {
        var formData = {
            email: $scope.loginForm.email,
            password: $scope.loginForm.password
        };

        if($scope.loginForm.email === '' || $scope.loginForm.password === '') {
            alert('Email and password required !');
            return;
        }
        Authentification.login(formData, function() {
            window.location = '/profile'; 
        }, function(errMsg) {
            console.log(errMsg);
        });
    };
});

webServicesProject.controller('modalLogoutController', function($scope, close, Users, Authentification) {
    $scope.close = close;

    $scope.logout = function() {
        Authentification.logout(function() {
            window.location = '/';
        });
    };
});