/*
Why use Passport?
-Passport allows different authentication strategies for flexible and modular use 
-Supports persistent sessions
*/

const config = require('./config'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
      
//JWT strategy options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

const jwtUserLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    jwt.verify(jwtOptions.jwtFromRequest, config.secret, function(err, decoded){
          if(err){
            return res.json({"type": 'response',
                             "success": false,
                             "reason": 'Failed to authenticate'});
          }else{
             req.decoded = decoded;
             console.log("Decoded: ", decoded.Role);
             
             /* TODO: Role authentication here, check for Role claim
             */
             
            return done(null, user);
          }
       });
    
});

passport.use(jwtUserLogin);