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
   passport.use('jwt-1',  new JwtStrategy(jwtOptions, function(payload, done) {
        console.log("Reached here??");
       console.log("Payload: ", payload["role"]);
       var string = payload["role"];
       if(string === 'Client'){
            return done(null, false);
       }
   }));
   //passport.use(strategy);
   return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function(){
            return passport.authenticate('jwt-1', { session: false });
        }
   };
};   
//passport.use(jwtUserLogin);