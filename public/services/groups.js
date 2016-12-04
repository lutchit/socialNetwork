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
        getAllDetailed: function(success, error) {
            return $http.get('/api/groupsDetailed').then(success, error);
        },
        create: function(group, success, error) {
            return $http.post('/api/groups/create', group).then(success, error);
        },
        join: function(groupId, userId, success, error) {
            return $http.put('/api/groups/join/' + groupId, { userId : userId }).then(success, error);
        },
        addComment: function(groupId, authorId, comment, success, error) {
            return $http.post('/api/groups/' + groupId + '/comments/create', { authorId: authorId, message: comment }).then(success, error);
        },
        remove: function(groupId, success, error) {
            return $http.delete('/api/groups/' + groupId).then(success, error);
        },
        modify: function(group, success, error) {
            return $http.put('/api/groups/' + group._id, group).then(success, error);
        },
        removeMember: function(groupId, userId, success, error) {
            return $http.delete('/api/groups/' + groupId + '/members/' + userId).then(success, error);
        }
    };

});