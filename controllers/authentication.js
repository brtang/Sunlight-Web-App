const jwt = require('jsonwebtoken');
      bcrypt = require('bcrypt-nodejs');
      
      config = require('../config/config');
      ADMIN = 'Admin';
      OWNER = 'Owner';
      CLIENT = 'Client';
      MEMBER = 'Member';

/* Unused function
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
*/

//Registration route for Client role
exports.generalregister = function(req, res, next){
    console.log("Reached registration route...");
    
    const email = req.body.email,
          firstName = req.body.firstName,
          lastName = req.body.lastName,
          company = req.body.company,
          password = req.body.password;
          //companyId;  
            
    //Check for registration errors
    //422 error code: Server understands the content type of request but was unable to process contained instructions
    if(!email){
        return res.render('sign-up-login-form', { error: 'You must enter an email address AHHHHHHHH. ' });
        //return res.status(422).send({ error: 'You must enter an email address AHHHHHHHH. ' });        
    }
    if(!firstName){
        return res.status(422).send({ error: 'You must enter a first name. '});
    }
    if(!lastName){
        return res.status(422).send({ error: 'You must enter a last name. '});
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
            //return res.status(422).send({ error: 'Company name is not registered in our database.' });  
             return res.render('sign-up-login-form', { error: 'Company name is not registered in our database.' });
        }
    })
    
    //Query DB for user
    db.users.findByEmail({
        Email: email
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data.length > 0){      
            return res.render('sign-up-login-form', { error: 'Email address is already in use.' });
            //return res.status(422).send({ error: 'Email address is already in use.' });
        }else{
            var hash = bcrypt.hashSync(password);
            console.log("No data returned, email has not been registered in the database!");
            return db.users.insert({
                  First_Name: firstName,
                  Last_Name: lastName,
                  Password: hash,
                  Email: email,                
                  Company: company,
                  Role: CLIENT,
                  //Company_Id: companyId
               })  
               .then(data => {
                  console.log("Reaching here means new User was created: ", data);
                  var token = jwt.sign({ role: data[0].role}, config.secret, {
                        expiresIn: 60*180*999999999 // expires in 180 mins
                  });
                  return res.render('sign-up-login-form', { success: 'Successfully registered user!' });
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

//Login route
exports.login = function( req, res, next) {
    console.log("Reached login route...");
    const email = req.body.email;
    const password = req.body.password;
  
    if(!email){
        return res.status(422).send({ error: 'You must enter an email address AHHHHHHH. ' });        
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
           return res.render('sign-up-login-form', { error: 'Invalid Email address or password.' });
           // return res.status(422).send({ error: 'Invalid Email address.' });
        }else{
            var hash = data[0].password;
            console.log("Hashed password in DB: ", hash);
            if(bcrypt.compareSync(password, hash)){
                console.log("Correct password... ");
                var token = jwt.sign({ role: data[0].role, companyId: data[0].user_id}, config.secret, {
                        expiresIn: 60*180*999999999 // expires in 180 mins
                }); 
                req.session.token = token;
                req.session.user = data;
                req.session.user[0].token = token;
                console.log(req.session.user[0].token);
                return res.redirect('/');
                /*
                return res.status(201).json({
                    Success: true,
                    Reason: 'Correct Email and Password.',
                    token: token,
                    Email: data[0].email,
                    Role: data[0].Role,
                    UserId: data[0].user_id,
                });
                */
            }else{
                console.log("Incorrect password... ");
                return res.render('sign-up-login-form', { error: 'Invalid Email address or password.' });
                //return res.status(422).send({ error: 'Invalid password.' });
            }
        }
        
    })
};



