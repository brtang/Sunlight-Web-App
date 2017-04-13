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
       done(null, true);
   }));
   //passport.use(strategy);
   passport.use('jwt-2',  new JwtStrategy(jwtOptions, function(payload, done) {
        console.log("Reached here??");
       console.log("Payload: ", payload["role"]);
       var string = payload["role"];
       if(string === 'Admin'){
            return done(null, false);
       }
       done(null, true);
   }));
   return {
        initialize: function() {
            return passport.initialize();
        },
        authenticateClient: function(){
            return passport.authenticate('jwt-1', { session: false });
        },
        authenticateAdmin: function(){
            return passport.authenticate('jwt-2', { session: false });
        }
   };
};   
//passport.use(jwtUserLogin);