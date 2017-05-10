const bodyParser = require('body-parser'); 
      bcrypt = require('bcrypt-nodejs');
      
exports.viewCompany = function(req, res, next){
    console.log("Reached viewCompany route!");
    console.log("Company is: ", req.body.name);
    
    var company = req.body.name;
    
    db.companies.findByName({
        Name: company
    })
    .then(data => {
        for(obj in data){
           console.log("This is batt volt: ", data);
       }
        console.log("Data: ", data[0].latitude);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });
    
    
    

};      
      
      
exports.viewPoles = function(req, res, next){
    console.log("Reached viewPoles route!");
    console.log("Company is: ", req.body.company);
    
    var company = req.body.company;
    
    db.poles.findByCompany({
        Company: company
    })
    .then(data => {
        for(obj in data){
           console.log("This is batt volt: ", data);
       }
        console.log("Data: ", data[1].xbee_mac_addr);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });
    
    
    

};

exports.updateUserInfo = function(req, res, next) {
    console.log("Reached updateUserInfo subroutine!");
    const email = req.body.email,
          firstName = req.body.firstName,
          lastName = req.body.lastName,
          password = req.body.password,
          user_id = req.session.user[0].user_id;
    
    var hash;
    
    db.users.findById({
        Id: user_id
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data.length == 0){      
            return res.send({ error: 'Email address is already in use.' });
            //return res.status(422).send({ error: 'Email address is already in use.' });
        }else{
            if(password.length > 1){
                hash = bcrypt.hashSync(password);
            }else{
                hash = data[0].password;
            }
            console.log("Updating User info...");
            return db.users.update({
                  First_Name: firstName,
                  Last_Name: lastName,
                  Password: hash,
                  Email: email, 
                  Id: user_id
               })  
               .then(data => {
                  console.log("Reaching here means User info was updated: ", data);
                  req.session.user = data;
                  req.session.user[0].token = req.session.token ;              
                  return res.send({ success: 'Successfully updated user info!' });
                  /*
                  res.status(201).json({
                    Success: true,
                    Reason: 'New email address and new user id.',
                    token: token,
                    Email: data[0].email,
                    Role: data[0].Role,
                    UserId: data[0].user_id
                  });*/
                })
        }
       
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });     
    
    

};