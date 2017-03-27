const jwt = require('jsonwebtoken');
      bcrypt = require('bcrypt-nodejs');
      config = require('../config/config');
      ADMIN = 'Admin';
      OWNER = 'Owner';
      CLIENT = 'Client';
      MEMBER = 'Member';


function getRole(checkRole){
   var role;
   
   switch(checkRole){
      case ADMIN: role = 4; break;
      case OWNER: role = 3; break;
      case CLIENT: role = 2; break;
      case MEMBER: role = 1; break;
      default: role = 1;
   }
   return role;
};

function comparePassword(candidatePassword, hash){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if (err) return cb(err);
    if(isMatch == false){
      console.log("Password incorrect");
    }
  });
}

//Registration route
exports.register = function(req, res, next){
    console.log("Reached registration route...");
    
    const email = req.body.email;
    const name = req.body.name;
    const company = req.body.company;
    const password = req.body.password;
    
    //Check for registration errors
    //422 error code: Server understands the content type of request but was unable to process contained instructions
    if(!email){
        return res.status(422).send({ error: 'You must enter an email address. ' });        
    }
    if(!name){
        return res.status(422).send({ error: 'You must enter a name. '});
    }
    if(!password){
        return res.status(422).send({ error: 'You must enter a password. '});
    }
    if(!company){
        return res.status(422).send({ error: 'You must enter a company. '});
    }
    
    //Query DB to see if company name exists
    db.companies.find({
        Name: company
    })
    .then(data => {
        console.log("This is data returned from Companies query: ", data);
        if(data.length < 1){
            console.log("Data:", data);
            return res.status(422).send({ error: 'Company name is not registered in our database.' });            
        }
    })
    
    //Query DB for user
    db.users.find({
        Email: email
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data){            
            return res.status(422).send({ error: 'Email address is already in use.' });
        }
         /*   
        return db.users.insert({
                  Name: name,
                  Password: password,
                  Email: email,                
                  Company: company
               })  
               .then(data => {
                  console.log("Reaching here means new User was created: ", data);
                  var token = jwt.sign(data, config.secret, {
                        expiresIn: 60*180*999999999 // expires in 180 mins
                  });
                  res.status(201).json({
                    succss: true,
                    reason: 'New user name and new user id',
                    token: token,
                    name: data[0].name,
                    user_id: data[0].user_id
                  });
                })*/
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });     
    
    

};


/*Login route
exports.login = function( req, res, next) {
  

};
*/