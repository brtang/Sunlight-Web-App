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
      

var app = express();

//Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
   extended: true
}));


app.set('port', process.env.PORT || 8080);


//Add static middleware
app.use(express.static(__dirname + '/public'));  

app.get('*', function (req, res){ 
    console.log("MADE IT!!!!!");
     res.sendFile( path.join( __dirname, '/public/modules/SignUpLogin', 'sign-up-login-form.html' ));
     console.log("MADE IT222222");
});

//Handle all routes in routes middleware
//app.use('/', routes);
routes(app);

/*
request.get(' https://devicecloud.digi.com/ws/DataPoint/00000000-00000000-00409DFF-FF78D78D/serial_data').auth('Sunlight', 'SunLight1!', true)
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

