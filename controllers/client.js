const bodyParser = require('body-parser'); 

exports.viewPoles = function(req, res, next){
    console.log("Reached viewPoles route!");
    console.log("Username is: ", req.params.userId);
    
    var userId = req.params.userId;
    
    return res.status(201).json({'fuck': 'fuckyou'});

};