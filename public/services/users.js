webServicesProject.factory('Users', function($http){

    return {
        account: function(success, error) {
            return $http.get('/account/me').then(success, error);
        }
    };

});