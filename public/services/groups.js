webServicesProject.factory('Groups', function($http){

    return {
        memberOf: function(id, success, error) {
            return $http.get('/api/groups/members/' + id).then(success, error);
        },
        get: function(groupId, success, error) {
            return $http.get('/api/groups/' + groupId).then(success, error);
        },
        getAll: function(success, error) {
            return $http.get('/api/groups').then(success, error);
        },
        join: function(groupId, userId, success, error) {
            return $http.put('/api/groups/join/' + groupId, { userId : userId }).then(success, error);
        },
        addComment: function(groupId, authorId, comment, success, error) {
            return $http.post('/api/groups/' + groupId + '/comments/create', { authorId: authorId, message: comment }).then(success, error);
        }
    };

});