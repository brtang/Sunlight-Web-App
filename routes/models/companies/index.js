const companies = require('express').Router();
      //user = require('../users');
      
//Find all companies in our DB
companies.post('/find', (req, res) => {
   db.companies.findAll()
    .then(data => {
        console.log("This is data: ", data);
        res.json({
          success: true,
          data: data
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
      
//Find Company by name
companies.post('/find/:name', (req,res) => { 
 
    db.companies.find({
        Name: req.params.name,
        Company_Id: req.body.company,
        Number_Of_Users: req.body.numUsers})
        .then(data => {
            console.log("This is data: ", data);
            if(!data){
              res.json({
                success: false,
                error: 'Company does not exist'
              });
            }else{
                console.log("Data:", data);
                res.json({
                    success: true,
                    reason: 'Correct company name',
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

//Create and insert new Company into db
companies.post('/insert/:name', (req,res) => {
    /*
    db.companies.find({
     Name: req.params.name,
     })
        .then(data => {
            console.log("This is data: ", data);
            if(data[0]){
              res.json({
                success: false,
                error: 'Company already exists'
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
    
    db.companies.insert({
        Name: req.params.name, 
        Number_Of_Users: req.body.numUsers                       
    })
    .then(data => {
       console.log("This is data: ", data);
       res.json({
        success: true,
        data: data
       }); 
    })
    .catch(error => {
        console.log("Error: ", error);
        res.json({
          success: false,
          error: error.message || error
        });
    });    
    */
    
    db.task(t => {
          return t.companies.find({
            Name: req.params.name
          })
            .then(data => {
                console.log("This is data: ", data);
                if(data[0]){
                    res.json({
                        success: false,
                        error: 'Company already exists'
                    });
                }else{
                    return  t.companies.insert({
                        Name: req.params.name, 
                        Number_Of_Users: req.body.numUsers                      
                    })
                    .then(data => {
                        console.log("Inside here?", data);
                        res.json({
                            succss: true,
                            reason: 'New company name and new company id',
                            name: data[0].name,
                            user_id: data[0].company_id
                        });
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
       })
       
      
});

//Update number of Users in Company
companies.post('/update/:name/:numUsers', (req,res) => {
        
    db.task(t => {
        return t.companies.find(req.params.name)
            .then(data => {
                console.log("This is data: ", data);
                if(!data){
                    res.json({
                        success: false,
                        error: 'Company does not exist'
                    });    
                }
                 return  t.companies.updateUsers({
                        numUsers: req.params.numUsers,
                        Name: req.params.name
                                              
                })
                .then(data => {
                  console.log("Inside here?", data);
                  res.json({
                    succss: true,
                    reason: 'Updated number of Users',
                    numUsers: data[0].Number_Of_users,    
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

//companies.use('/user', user);

module.exports = companies;