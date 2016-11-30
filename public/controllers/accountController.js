webServicesProject.controller('AccountController', function($scope, $http, $routeParams, Authentification, Users, Groups, ModalService) {
    $scope.auth = Authentification;
    $scope.close = close;
    $scope.isUpdating = false;
    $scope.newUser = {};

    if($routeParams.userId === 'me') {
        $scope.isMe = true;
        // $scope.user = {
        //     "_id": "SkwPjJCWe",
        //     "email": "ludovictichit3@gmail.com",
        //     "password": "$2a$10$ktzplgcGQAobRt5XqwPkZuHFYrop.8b6LrYqYcnSZG.X.dJ8ZvY9m",
        //     "firstname": "ludovic",
        //     "lastname": "tichit",
        //     "registrationDate": "2016-11-19T00:00:00.000Z",
        //     "biography": "",
        //     "__v": 0
        // };
    } else {
        // $scope.otherUser = {
        //     "_id": "test",
        //     "email": "corentintichit@gmail.com",
        //     "firstname": "corentin",
        //     "lastname": "tichit",
        //     "registrationDate": "2016-11-25T00:00:00.000Z",
        //     "biography": "he salut",
        //     "__v": 0
        // };
        $scope.isMe = false;
        Users.get(function(user) {
            $scope.otherUser = user;
        }, function(err) {
            console.log('Cannot get the user :' + $routeParams.userId);
        });
    }

    if(Authentification.isAuthenticated()) {
        Users.account(function(result) {
            $scope.user = result.data;
            $scope.newUser = $scope.user;
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
            templateUrl: "templates/signinModal.html",
            controller: "modalSigninController"
        }).then(function(modal) {
            modal.close.then(function() {
                
            });
        });
    };

    $scope.showLoginForm = function() {
        ModalService.showModal({
            templateUrl: "templates/loginModal.html",
            controller: "modalLoginController"
        }).then(function(modal) {
            modal.close.then(function() {
                
            });
        });
    };

    $scope.showLogout = function() {
        ModalService.showModal({
            templateUrl: "templates/logoutModal.html",
            controller: "modalLogoutController"
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
        pseudo: ''
    };

    $scope.signin = function() {

        var formData = {
            email: $scope.newUser.email,
            password: $scope.newUser.password,
            pseudo: $scope.newUser.pseudo
        };

        if($scope.newUser.email === '' || $scope.newUser.password === '' || $scope.newUser.pseudo === '') {
            alert('Email, password and pseudo required !');
            if($scope.newUser.email === '')
                
            if($scope.newUser.password === '')

            return;
        }
        else {
            Authentification.register(formData, function(res) {
                if (res.type === false) {
                    alert(res.data);
                } else {
                    window.location = "/profile";
                }
            }, function() {
                window.location = "/";
            });
        }
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
            alert('Email and password requireddddd !');
            if($scope.loginForm.email === '')
                
            if($scope.loginForm.password === '')

            return;
        }
        Authentification.login(formData, function() {
            window.location = "/profile"; 
        }, function(errMsg) {
            console.log(errMsg);
        });
    };
});

webServicesProject.controller('modalLogoutController', function($scope, close, Users, Authentification) {
    $scope.close = close;

    $scope.logout = function() {
        Authentification.logout(function() {
            window.location = "/";
        });
    };
});