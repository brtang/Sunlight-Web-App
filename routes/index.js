const routes = require('express').Router();
      models = require('./models');

routes.use('/models', models);

routes.get('/', (req, res) => {
  console.log("We got a req: ", req);
  res.status(200).json({ message: 'Connected!'});
});



module.exports = routes;
