const jwt = require('jsonwebtoken');
      bcrypt = require('bcrypt');
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
      //Do something
    }
  });
}

//Registration route
exports.register = function(req, res, next){
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
    //Todo: modify db.users.find to take in email argument
    db.users.find({
        Email: email
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data){            
            return res.status(422).send({ error: 'Email address is already in use.' });
        }
            
        return db.users.insert({
                  Name: name,
                  Email: email,
                  
               })        
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });     
    
    

};


//Login route
exports.login = function( req, res, next) {
  

};