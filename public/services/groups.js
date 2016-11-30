webServicesProject.factory('Groups', function($http){

    return {
        memberOf: function(id, success, error) {
            return $http.get('/groups/members/' + id).then(success, error);
        },
        get: function(groupId, success, error) {
            return $http.get('/groups/' + groupId).then(success, error);
        }
    };

});