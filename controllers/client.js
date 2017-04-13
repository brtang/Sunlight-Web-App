const bodyParser = require('body-parser'); 

exports.viewPoles = function(req, res, next){
    console.log("Reached viewPoles route!");
    console.log("Username is: ", req.params.username);
    return res.status(201).json({'fuck': 'fuckyou'});

};