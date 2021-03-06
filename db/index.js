var config = require('../config/config');

var repos = {
    users: require('./repos/users'),
    companies: require('./repos/companies'),
    poles: require('./repos/poles'),
    notification: require('./repos/notifications')
};

var options = {
   
    // Extending the database protocol with our custom repositories:
    extend: obj => {

        obj.users = repos.users(obj, pgp);
        obj.companies = repos.companies(obj, pgp);
        obj.poles = repos.poles(obj, pgp);
        obj.notifications = repos.notification(obj, pgp);
    }

};

// Database connection parameters:
var config = {
  user: config.user,
  password: config.password,
  host: config.host,
  database: config.database,
  port: config.port, 
};

// Load and initialize pg-promise:
var pgp = require('pg-promise')(options);

// Create the database instance:
var db = pgp(config);

module.exports = db;