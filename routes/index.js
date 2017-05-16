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
      adminRoutes = express.Router();    
  
  
//Set model routes (mainly used for db testing)
routes.use('/models', models);


//General Registration route
app.post('/registration', AuthenticationController.generalregister);

//General Log-in route
app.post('/login', AuthenticationController.login);

//Initialize Passport 
app.use(passportService.initialize());

app.post('/user', passportService.authenticateClient(), ClientController.updateUserInfo);

//Route for testing Passport
app.get('/protected', passportService.authenticateClient(), (req, res) => {
    res.send({ content: 'The protected Client test route is functional!' });
  });
  
//Route for Admin panel  
app.use('/admin', passportService.authenticateAdmin(),
    //res.send({ content: 'The protected Admin test route is functional!' });
   // console.log(path.join(__dirname,'/../public'));
    express.static(path.join(__dirname,'/../public'),{index: ['admin.html','index.html']})
    //,{index: ['admin.html','index.html']}
);

//= ==================================
//  Client Routes
//= ==================================
 
clientRoutes.post('/poles',  passportService.authenticateClient(),  ClientController.viewPoles);

clientRoutes.post('/company', passportService.authenticateClient(), ClientController.viewCompany);
 
 app.use('/client', clientRoutes);

 
adminRoutes.get('/company', passportService.authenticateAdmin(), ClientController.viewCompanies);

app.use('/admin', adminRoutes);


};