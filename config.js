module.exports = {
    // The port to serve application
    port: process.env.PORT || '3000',

    users: require('./lib/users')(),
}