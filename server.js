//Get the packages that we need =============
//==========================================
const express = require('express');
      pg = require('pg');
      db = require('./db');
      request = require('request');
      bodyParser = require('body-parser'); 
      bcrypt = require('bcrypt-nodejs');
      config = require('./config/config');
      routes = require('./routes');
      session = require('express-session');

var app = express();

//Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true}));

//Add static middleware
//app.use(express.static(__dirname + '/public'));  

app.set('view engine', 'ejs');
//app.set('views', __dirname + '/views');
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.set('port', process.env.PORT || 8080);


app.get('/login', function(req, res) {
    // log user out
    delete req.session.token;

    
    console.log("Rendering login EJS view...");
    res.render('sign-up-login-form');
});


app.get('*', function (req, res, next){ 

     if (req.path !== '/login' && !req.session.token) {
        console.log("Redirecting to login...");
        return res.redirect('/login');
    }
    
    console.log("Redirecting to next..." + req.session.user[0].first_name);
    next();
});

app.get('/user', function (req, res) {
  console.log("Reached /user route..." + req.session.user[0].token);
  var name = req.session.user[0];
  res.send(name);
});

app.get('/token', function (req, res) {
    console.log("Reached /token route...");
    res.send(req.session.token);
});

app.use('/', express.static(__dirname + '/public'));




//Handle all routes in routes middleware
//app.use('/', routes);
routes(app);

/*
request.get(' https://devicecloud.digi.com/ws/DataPoint/00000000-00000000-00409DFF-FF78D78D/serial_data?size=10').auth('Sunlight', 'SunLight1!', true)
    .on('response', function(response){
       console.log(response.statusCode);
      // response.setEncoding('utf8');
       response.on("data", function(chunk) {
         console.log("BODY: " + chunk);
        });
    });
*/

app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

