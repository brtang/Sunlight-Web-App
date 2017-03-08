const models = require('express').Router();
      users = require('./users');
      companies = require('./companies');
      groups = require('./Groups');
      poles = require('./Poles');
      regions = require('./Regions');
      
      
models.use('/users', users);
models.use('/companies', companies);

module.exports = models;