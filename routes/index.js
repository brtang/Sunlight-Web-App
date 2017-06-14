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


//Route for Admin panel  
app.use('/admin', passportService.authenticateAdmin(),
    //res.send({ content: 'The protected Admin test route is functional!' });
   // console.log(path.join(__dirname,'/../public'));
    express.static(path.join(__dirname,'/../admin'),{index: ['admin.html']})
    //,{index: ['admin.html','index.html']}
);

//= ==================================
//  Client Routes
//= ==================================
 
clientRoutes.post('/updatePole', passportService.authenticateClient(), ClientController.updatePole); 
 
clientRoutes.post('/poles',  passportService.authenticateClient(),  ClientController.viewPoles);

clientRoutes.post('/company', passportService.authenticateClient(), ClientController.viewCompany);

clientRoutes.post('/notification', passportService.authenticateClient(), ClientController.viewNotification);

clientRoutes.post('/deleteNotification', passportService.authenticateClient(), ClientController.deleteNotification);
 
 app.use('/client', clientRoutes);

 
adminRoutes.get('/company', passportService.authenticateAdmin(), ClientController.viewCompanies);

adminRoutes.post('/company', passportService.authenticateAdmin(), ClientController.updateCompanies);

adminRoutes.post('/addCompany', passportService.authenticateAdmin(), ClientController.addCompanies);

adminRoutes.get('/users', passportService.authenticateAdmin(), ClientController.viewUsersByCompany);

adminRoutes.post('/addAdmin', passportService.authenticateAdmin(), ClientController.addAdmin);

adminRoutes.get('/poles', passportService.authenticateAdmin(), ClientController.viewPolesByCompany);

adminRoutes.post('/addPole', passportService.authenticateAdmin(), ClientController.addPole);

app.use('/admin', adminRoutes);


};