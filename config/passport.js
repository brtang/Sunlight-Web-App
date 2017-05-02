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
    //jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};



module.exports = function(){
   //Jwt strategy to authenticate user's with Client role
   passport.use('jwt-1',  new JwtStrategy(jwtOptions, function(payload, done) {
        console.log("Payload: ", payload["role"]);
        var string = payload["role"];
        if(string === 'Client'){
            return done(null, true);
        }else{
            return done(null, false);
        }
   }));
   
   //Jwt strategy to authenticate user's with Admin role
   passport.use('jwt-2',  new JwtStrategy(jwtOptions, function(payload, done) {
        console.log("Payload: ", payload["role"]);
        console.log("Company: ", payload["companyId"]);
        var string = payload["role"];
        if(string === 'Admin'){
            return done(null, true);
        }else{
            return done(null, false);
        }
        
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
