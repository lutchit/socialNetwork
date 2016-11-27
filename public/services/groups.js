webServicesProject.factory('Groups', function($http){

    return {
        memberOf: function(id, success, error) {
            return $http.get('/groups/members/' + id).then(success, error);
        }
    };

});