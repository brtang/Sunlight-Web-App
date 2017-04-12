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
exports.generalregister = function(req, res, next){
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
    db.users.findByEmail({
        Email: email
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data.length > 0){            
            return res.status(422).send({ error: 'Email address is already in use.' });
        }else{
            var hash = bcrypt.hashSync(password);
            console.log("No data returned, email has not been registered in the database!");
            return db.users.insert({
                  Name: name,
                  Password: hash,
                  Email: email,                
                  Company: company,
                  Role: CLIENT
               })  
               .then(data => {
                  console.log("Reaching here means new User was created: ", data);
                  var token = jwt.sign({ role: data[0].role}, config.secret, {
                        expiresIn: 60*180*999999999 // expires in 180 mins
                  });
                  res.status(201).json({
                    success: true,
                    reason: 'New email address and new user id.',
                    token: token,
                    name: data[0].name,
                    //user_id: data[0].user_id,
                    role: data[0].Role
                  });
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



exports.login = function( req, res, next) {
    console.log("Reached login route...");
    const email = req.body.email;
    const password = req.body.password;
  
    if(!email){
        return res.status(422).send({ error: 'You must enter an email address. ' });        
    }
    if(!password){
        return res.status(422).send({ error: 'You must enter a password. '});
    }
  
    db.users.findByEmail({
        Email: email
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data.length == 0){            
            return res.status(422).send({ error: 'Invalid Email address.' });
        }else{
            var hash = data[0].password;
            console.log("Hashed password in DB: ", hash);
            if(bcrypt.compareSync(password, hash)){
                console.log("Correct password... ");
                var token = jwt.sign({ role: data[0].role}, config.secret, {
                        expiresIn: 60*180*999999999 // expires in 180 mins
                });
                return res.status(201).json({
                    success: true,
                    reason: 'Correct Email and Password.',
                    token: token,
                    name: data[0].name,
                    //user_id: data[0].user_id,
                    role: data[0].Role
                });
            }else{
                console.log("Incorrect password... ");
                return res.status(422).send({ error: 'Invalid password.' });
            }
        }
        
    })
};
