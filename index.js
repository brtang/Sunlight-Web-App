//Get the packages that we need =============
//==========================================
const express = require('express');
      pg = require('pg');
      
var client = new pg.Client({
  user: 'bitnami',
  password: 'bitnami',
  host: 'localhost',
  database: 'bitnami',
  port: 5432, 
});

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to postgres");
});

var app = express();
app.set('port', process.env.PORT || 8080);


app.get('/', function(req,res){
  res.send("Hi! This is the great!");
});


app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

