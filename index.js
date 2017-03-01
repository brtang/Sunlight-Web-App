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

app.use('/', routes);

/*

//Insert new user into db
app.post('/users/insert/:name', (req,res) => {
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
    db.task(t => {
          return t.users.count()
            .then(count => {
                user_id = count;
                return  t.users.insert({
                        Name: req.params.name, 
                        User_Id: user_id, 
                        Company_Id: req.body.company,
                        Role: req.body.role                        
                })
                .then(data => {
                  console.log("Inside here?", data);
                  res.json({
                    succss: true,
                    reason: 'New user name and new user id',
                    name: data[0].name,
                    user_id: data[0].user_id
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
       })
      
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
*/

app.listen(app.get('port'), function(){
   console.log('Express started on http://localhost:' + 
   app.get('port') + '; press Ctrl-C to terminate.');
});

