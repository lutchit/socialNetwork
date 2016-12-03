webServicesProject.factory('Authentification', function($q, $http, $window){

    var isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
        var token = window.localStorage.getItem('jwtToken');
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token) {
        window.localStorage.setItem('jwtToken', token);
        useCredentials(token);
    }
    
    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
    
        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
    }
    
    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = undefined;
        window.localStorage.removeItem('jwtToken');
    }
    
    var register = function(user, resolve, reject) {
        $http.post('/api/account/signup', user).then(function(result) {
            if (result.data) {
                storeUserCredentials(result.data.token);
                resolve(result.data.user);
            } else {
                reject(result.data.msg);
            }
        });
    };

    var login = function(user, resolve, reject) {
        $http.post('/api/account/authenticate', user).then(function(result) {
            if (result.data) {
                storeUserCredentials(result.data.token);
                resolve(result.data.user);
            } else {
                reject(result.data);
            }
        });
    };  

    var remove = function(user, resolve, reject) {
        $http.delete('/api/account/' + user._id, user).then(function(result) {
            if (result.data) {
                destroyUserCredentials();
                resolve();
            } else {
                reject(result.data);
            }
        });
    };
    
    var logout = function(resolve) {
        destroyUserCredentials();
        resolve();
    };
    
    loadUserCredentials();

    return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() { 
            return isAuthenticated;
        },
        remove: remove
    };
});