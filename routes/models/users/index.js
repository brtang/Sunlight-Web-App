const users = require('express').Router();


//Read user by name
users.get('/find/:name', (req,res) => { 
    db.users.find(req.params.name)
        .then(data => {
            console.log("This is data: ", data);
            if(!data){
              res.json({
                success: false,
                error: 'User does not exist'
              });
            }else{
                res.json({
                    success: true,
                    reason: 'Correct user name',
                    data
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
}); 

//Create and insert new user into db
users.post('/insert/:name', (req,res) => {
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
          return t.users.countId()
            .then(count => {
                user_id = count[0].user_id + 1;
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

//Update User element
users.post('/update/:name', (req,res) => {
        
    db.task(t => {
        return t.users.find(req.params.name)
            .then(data => {
                console.log("This is data: ", data);
                if(!data){
                    res.json({
                        success: false,
                        error: 'User does not exist'
                    });    
                }
                 return  t.users.updateName({
                        newName: req.body.newName,
                        Name: req.params.name
                                              
                })
                .then(data => {
                  console.log("Inside here?", data);
                  res.json({
                    succss: true,
                    reason: 'Updated new user name',
                    name: data[0].name,    
                  });
                })
            
            })
            .catch(error => {
                console.log("Error: ", error);
                res.json({
                    success: false,
                    error: error.message || error
                });
            });  
    })    
        
});


//Delete User
users.post('/delete/:name', (req,res) => {
        
    db.task(t => {
        return t.users.find(req.params.name)
            .then(data => {
                console.log("This is data: ", data);
                if(!data){
                    res.json({
                        success: false,
                        error: 'User does not exist'
                    });    
                }
                 return  t.users.deleteUser(req.params.name)
                    .then(data => {
                        console.log("Inside here?", data);
                        res.json({
                            succss: true,
                            reason: 'Deleted user with name',
                            rowCount: data.rowCount,    
                        });
                    });
            
            })
            .catch(error => {
                console.log("Error: ", error);
                res.json({
                    success: false,
                    error: error.message || error
                });
            });  
    })    
        
});

module.exports = users;
