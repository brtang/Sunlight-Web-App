const poles = require('express').Router();

//Find all Poles in our DB
poles.post('/find', (req, res) => {
   db.poles.findAll()
    .then(data => {
        console.log("This is data: ", data);
        res.json({
          success: true,
          data: data
        });
        
    }) 
    .catch(error => {
            console.log("Error: ", error);
            res.json({
                success: false,
                error: error.message || error
            });
    });    
});     


//Create and insert new Pole into db
poles.post('/insert/:companyid/:addr', (req,res) => {

    db.task(t => {
          return t.poles.findAll({
            XBee_MAC_addr: req.params.addr
          })
            .then(data => {
                console.log("This is data: ", data);
                if(data[0]){
                    res.json({
                        success: false,
                        error: 'Pole already exists'
                    });
                }else{
                    return  t.poles.insert({
                        XBee_MAC_addr: req.params.addr, 
                        Group_Id: NULL, //req.body.Group_Id,
                        Region_Id: NULL,//req.body.Region_Id,
                        Company_Id: req.params.companyid                      
                    })
                    .then(data => {
                        console.log("Inside here?", data);
                        res.json({
                            succss: true,
                            reason: 'New XBee Mac addr and valid companyId',
                            name: data[0].XBee_MAC_addr,
                            user_id: data[0].Company_id
                        });
                    });
                }    
            })
            .catch(error => {
                console.log("Error: ", error);
                res.json({
                    success: false,
                    error: error.message || error
                });
            });       
       })
       
      
});

module.exports = poles;