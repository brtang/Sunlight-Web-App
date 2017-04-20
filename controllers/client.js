const bodyParser = require('body-parser'); 

exports.viewPoles = function(req, res, next){
    console.log("Reached viewPoles route!");
    console.log("Username is: ", req.params.companyId);
    
    var userId = req.params.userId;
    
    
    

};