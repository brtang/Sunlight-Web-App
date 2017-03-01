const models = require('express').Router();
      users = require('./users');

models.use('/users', users);

module.exports = models;