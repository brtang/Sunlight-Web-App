//Get the packages that we need =============
//==========================================
const express = require('express');
      pg = require('pg');
      db = require('./db');
      config = require('./config/config');

/*      
var client = new pg.Client({
  user: config.user,
  password: config.password,
  host: config.host,
  database: config.database,
  port: config.port, 
});

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to postgres");
});*/

var app = express();
app.set('port', process.env.PORT || 8080);


app.get('/', function(req,res){
  res.send("Hi! This is the great!");
});

//Insert new user into db
app.get('/users/insert/:name', (req,res) => {
    db.users.find(req.params.name)
        .then(data => {
            console.log("This is data: ", data);
            if(data){
              res.json({
                success: false,
                error: 'User already exists'
            });
            }
            
        })
        .catch(error => {
            console.log("Error: ", error);
            res.json({
                success: false,
                error: error.message || error
            });
        });        
    var user_id;
    db.users.count()
        .then(data => {
            user_id = data;
            console.log("This is user_id for new user: ", user_id);
        })
        .catch(error => {
            console.log("Error: ", error);
            res.json({
                success: false,
                error: error.message || error
            });
        });   
    
            
});

//Find user by name
app.get('/users/find/:name', (req,res) => { 
    db.users.find(req.params.name)
        .then(data => {
            console.log("This is data: ", data);
            
        })
        .catch(error => {
            console.log("Error: ", error);
            res.json({
                success: false,
                error: error.message || error
            });
        });        
});

//Find group by name
app.get('/groups/find/:name', (req,res) => {
    db.groups.find(req.params.name)
        .then(data => {
            console.log("This is data: ", data);
            res.json({
              success:true,
              data
            });  
        })
        .catch(error => {
            console.log("Error: ", error);
            res.json({
                success: false,
                error: error.message || error
            });
        });        
});

//Find company by name
app.get('/company/find/:name', (req,res) => {
    db.users.find(req.params.name)
        .then(data => {
            console.log("This is data: ", data);
            res.json({
              success:true,
              data
            });  
        })
        .catch(error => {
            console.log("Error: ", error);
            res.json({
                success: false,
                error: error.message || error
            });
        });        
});

app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

