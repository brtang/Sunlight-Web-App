const routes = require('express').Router();
      models = require('./models');
      AuthenticationController = require('../controllers/authentication');
      
routes.use('/models', models);

routes.get('/', (req, res) => {
  console.log("We got a req: ", req);
  res.status(200).json({ message: 'Connected!'});
});

routes.post('/register', AuthenticationController.register);


module.exports = routes;
