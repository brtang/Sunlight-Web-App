const routes = require('express').Router();
      models = require('./models');
      express = require('express');
      config = require('../config/config');
      jwt = require('jsonwebtoken');
      passport = require('passport');
      AuthenticationController = require('../controllers/authentication');
      passportService = require('../config/passport')();
      


module.exports = function(app){
      
routes.get('/', (req, res) => {
  console.log("We got a req: ", req);
  res.status(200).json({ message: 'Connected!'});
});

//Set model routes (mainly used for db testing)
routes.use('/models', models);

//General Registration route
app.post('/registration', AuthenticationController.generalregister);

//General Log-in route
app.post('/login', AuthenticationController.login);

app.use(passportService.initialize());

 app.post('/protected', passportService.authenticate(), (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });


var apiRoutes = express.Router(); 


//Middleware to verify incoming JWT token
apiRoutes.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
   
    if(token){
       jwt.verify(token, config.secret, function(err, decoded){
          if(err){
            return res.json({"type": 'response',
                             "success": false,
                             "reason": 'Failed to authenticate'});
          }else{
             req.decoded = decoded;
             console.log("Decoded: ", decoded);
             
             /* TODO: Role authentication here, check for Role claim
             */
             
             next();
          }
       });
    }else{
      return  res.status(403).send({"type": 'resopnse',
                                    "success": false,
                                    "reason": 'No token provided'});
    }
    
});

apiRoutes.post('/test/', function(req, res){
   console.log("Made it to test route!");
});

app.use('/api', apiRoutes);


};