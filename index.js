//Get the packages that we need =============
//==========================================
const express = require('express');
      pg = require('pg');
      db = require('./db');
      request = require('request');
      bodyParser = require('body-parser'); 
      config = require('./config/config');
      routes = require('./routes');
      

var app = express();

//Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
   extended: true
}));

app.set('port', process.env.PORT || 8080);

//Handle all routes in routes middleware
app.use('/', routes);

request.get(' https://devicecloud.digi.com/ws/DataPoint/00000000-00000000-00409DFF-FF78D78D/serial_data').auth('Sunlight', 'SunLight1!', true)
    .on('response', function(response){
       console.log(response.statusCode);
      // response.setEncoding('utf8');
       response.on("data", function(chunk) {
         console.log("BODY: " + chunk);
        });
    });


app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

