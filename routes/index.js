const routes = require('express').Router();
      models = require('./models');
      express = require('express');
      config = require('../config/config');
      jwt = require('jsonwebtoken');
      passport = require('passport');
      AuthenticationController = require('../controllers/authentication');
      ClientController = require('../controllers/client');
      passportService = require('../config/passport')();
      path = require('path');


module.exports = function(app){
//Initialize route groups
const apiRoutes = express.Router(), 
      clientRoutes = express.Router(),
      adminRoutes = express.router;    
  
  
//Set model routes (mainly used for db testing)
routes.use('/models', models);

//General Registration route
app.post('/registration', AuthenticationController.generalregister);

//General Log-in route
app.post('/login', AuthenticationController.login);

//Initialize Passport 
app.use(passportService.initialize());

//Route for testing Passport
app.post('/protected', passportService.authenticateClient(), (req, res) => {
    res.send({ content: 'The protected Client test route is functional!' });
  });
  
//Route for testing Passport  
app.post('/protectedAdmin', passportService.authenticateAdmin(), (req, res) => {
    res.send({ content: 'The protected Admin test route is functional!' });
});

//= ==================================
//  Client Routes
//= ==================================
 
 clientRoutes.get('/:companyId', passportService.authenticateClient(), ClientController.viewPoles);
 
 app.use('/client', clientRoutes);



apiRoutes.post('/test/', function(req, res){
   console.log("Made it to test route!");
});

app.use('/api', apiRoutes);




};