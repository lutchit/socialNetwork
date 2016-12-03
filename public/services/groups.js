webServicesProject.factory('Groups', function($http){

    return {
        memberOf: function(id, success, error) {
            return $http.get('/groups/members/' + id).then(success, error);
        },
        get: function(groupId, success, error) {
            return $http.get('/groups/' + groupId).then(success, error);
        },
        getAll: function(success, error) {
            return $http.get('/groups').then(success, error);
        },
        join: function(groupId, userId, success, error) {
            return $http.put('/groups/join/' + groupId, { userId : userId }).then(success, error);
        }
    };

});