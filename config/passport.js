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
    jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
    secretOrKey: config.secret
};



module.exports = function(){
   var strategy = new JwtStrategy(jwtOptions, function(payload, done) {
        console.log("Reached here??");
       console.log("Payload: ", payload);
   });
   passport.use(strategy);
   return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function(){
            return passport.authenticate("jwt", { session: false });
        }
   };
};   
//passport.use(jwtUserLogin);