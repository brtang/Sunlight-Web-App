//Get the packages that we need =============
//==========================================
const express = require('express');
      pg = require('pg');
      db = require('./db');
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



app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

