'use strict';

module.exports = {
    // The port to serve application
    port: process.env.PORT || '3000',

    users: require('./lib/users')(),

    groups: require('./lib/groups')(),

    mongo: {
        development: 'mongodb://lutichit:tihcitul@ds033607.mlab.com:33607/webservicessocialnetwork',
        test: 'mongodb://lutichit:tihcitul@ds019634.mlab.com:19634/webservicessocialnetworktest'
    },
};