webServicesProject.factory('Users', function($http){

    return {
        account: function(success, error) {
            return $http.get('/account/me').then(success, error);
        },
        modify: function(data, success, error) {
            return $http.put('/account/' + data._id, data).then(success, error);
        },
        get: function(userId, success, error) {
            return $http.get('/account/' + userId).then(success, error);
        }
    };

});