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
      xml2js = require('xml2js');
      util = require('util');
       
        
var app = express();

//Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true}));

//Add static middleware
//app.use(express.static(__dirname + '/public'));  

app.set('view engine', 'ejs');
//app.set('views', __dirname + '/views');
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.set('port', process.env.PORT || 8080);

app.get('/forgotPassword', function(req, res){
    res.render('forgot-password');
});

app.get('/login', function(req, res) {
    // log user out
    delete req.session.token;

    
    console.log("Rendering login EJS view...");
    res.render('sign-up-login-form');
});


app.get('/', function (req, res, next){ 
    /* */
    if (req.session.user) {
        if(req.session.user[0].role === 'Admin'){
            return res.redirect('/admin');
        }
    } 
    
    console.log("Redirecting to next..." );
    next();
});


app.get('*', function(req, res, next){
    
     if (req.path !== '/login' && !req.session.token) {
        console.log("Redirecting to login...");
        return res.redirect('/login');
    }
    next();
});

app.get('/user', function (req, res) {
  console.log("Reached /user route..." + req.session.user[0].role);
 
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
var CronJob = require('cron').CronJob;
new CronJob('*//*5 * * * * *', function() {
var date = new Date();

  console.log('You will see this message every 5 second...' + date.toISOString());
  db.notifications.insert({
    Time_stamp: date.toISOString(),
    Company: 'UCSC',
    Color: 'cyan',
    Alert_type: 'danger',
    Unread: true,
    Text: 'Inserted Notifcation'
  }).then(data => {
    console.log("This is data returned from Notifications insert: ", data);
  })
  .catch(error => {
    console.log("Error: ", error);
    
  });
 
  
}, null, true, 'America/Los_Angeles'); */

/*&startTime=1970-01-01T00:01:47.000Z */
//2017-05-08T23:26:50.710Z

var parser = new xml2js.Parser({explicitArray: false});
var latestTime;
//var digiRoute = ' https://devicecloud.digi.com/ws/DataPoint/00000000-00000000-00409DFF-FF78D78D/serial_data?size=50&startTime=';

var digiRoute = ' https://devicecloud.digi.com/ws/DataPoint/00000000-00000000-00409DFF-FF78D78D/serial_data';
/*
db.poles.getLatestTime()
.then(data => {
    console.log("This is data: ", data[0].time_stamp);
    latestTime = data[0].time_stamp;
    console.log(latestTime);
    digiRoute = digiRoute + latestTime.toISOString();
    console.log(digiRoute);
    request.get(digiRoute).auth('Sunlight', 'SunLight1!', true)
    .on('response', function(response){
       console.log(response.statusCode);
      // response.setEncoding('utf8');
       var body = '';
       response.on("data", function(chunk) {
         body += chunk;
        });
       response.on("end", function(){
            parser.parseString(body, function(err, result){
            console.log(result.result.DataPoint);
            
            console.log(result.result.DataPoint.length);
          
            
         });
       }); 
    });
    
    
})
.catch(error => {
        console.log("Error: ", error);
});     
*/
/*
request.get(digiRoute).auth('Sunlight', 'SunLight1!', true)
    .on('response', function(response){
       console.log(response.statusCode);
      // response.setEncoding('utf8');
       var body = '';
       response.on("data", function(chunk) {
         body += chunk;
        });
       response.on("end", function(){
            parser.parseString(body, function(err, result){
            console.log(result.result.DataPoint);
            
            console.log(result.result.DataPoint.length);
            var datapoints = result.result.DataPoint;
            for(var i = 0; i < datapoints.length; i++){
                var string = datapoints[i].data.toString().split(/"/);
                console.log(string[7]);
                console.log(string[3]);
            }
            
         });
       }); 
    });
*/

/*

  var date = new Date();
  console.log("Date ISO: ", date.toISOString);
  console.log("Date time: ", date.toUTCString());
  
*/  

app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

