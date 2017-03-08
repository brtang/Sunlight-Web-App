const companies = require('express').Router();
      user = require('../users');
//Read Company by name

companies.post('/find/:name', (req,res) => { 
    db.users.find({
        Name: req.params.name,
        Company_Id: req.body.company,
        Number_Of_users: req.body.numUsers})
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
    db.companies.find(req.params.name)
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
    var company_id;
    db.task(t => {
          return t.companies.countId()
            .then(count => {
                company_id = count[0].company_id + 1;
                return  t.users.insert({
                        Name: req.params.name, 
                        Company_Id: company_id, 
                        Number_Of_users: 0                       
                })
                .then(data => {
                  console.log("Inside here?", data);
                  res.json({
                    succss: true,
                    reason: 'New company name and new company id',
                    name: data[0].name,
                    user_id: data[0].company_id
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

companies.use('/user', user);

module.exports = companies;