const routes = require('express').Router();
      models = require('./models');

routes.use('/', models);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!'});
});



module.exports = routes;
