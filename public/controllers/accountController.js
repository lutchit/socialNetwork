webServicesProject.controller('AccountController', function($scope, $http, $sce, Authentification, Users, ModalService) {
    $scope.profile = Users;
    $scope.auth = Authentification;
    $scope.close = close;
    $scope.HTML = '<b>Hello</b>';
    $scope.trust = $sce.trustAsHtml;

    if(Authentification.isAuthenticated()) {
        Users.account(function(result) {
            $scope.user = result.data;
        }, function(error) {
            console.log('Cannot get the user account');
        });
    }

    $scope.showDate = function(date, numberToRemove) {
        return new Date(date).toUTCString().slice(0, new Date(date).toUTCString().length - numberToRemove);
    }

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