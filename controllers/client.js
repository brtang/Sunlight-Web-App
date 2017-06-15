const bodyParser = require('body-parser'); 
      bcrypt = require('bcrypt-nodejs');
      request = require('request');
       ADMIN = 'Admin';

exports.viewUsersByCompany = function(req, res, next){
    console.log("Reached viewUsersByCompany route!");
    db.users.orderByCompany()
    .then(data => {
        console.log("THIS IS DATAAAA: ", data);
        /*
        for(obj in data){
           console.log("This is orderByCompany data!!!!!: ", data);
       }
       */
        return res.send(data);
    })
     .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });

};

exports.viewPolesByCompany = function(req, res, next){
    console.log("Reached viewPolesByCompany route!");
    db.poles.orderByCompany()
    .then(data => {
        console.log("THIS IS DATAAAA: ", data);
        /*
        for(obj in data){
           console.log("This is orderByCompany data!!!!!: ", data);
       }
       */
        return res.send(data);
    })
     .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });

};


exports.addAdmin = function(req, res, next){

 console.log("Reached addAdmin route...");
    
    const email = req.body.email,
          firstName = req.body.firstname,
          lastName = req.body.lastname,
          password = req.body.password;
       

 
    //Query DB for user
    db.users.findByEmail({
        Email: email
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data.length > 0){      
            return res.send({ success: false, error: 'Email address is already in use.' });
            //return res.status(422).send({ error: 'Email address is already in use.' });
        }else{
            var hash = bcrypt.hashSync(password);
            console.log("No data returned, email has not been registered in the database!");
            db.users.insert({
                  First_Name: firstName,
                  Last_Name: lastName,
                  Password: hash,
                  Email: email,                
                  Company: 'Mira Bella',
                  Role: ADMIN,
                  //Company_Id: companyId
               })  
               .then(data => {
                  console.log("Reaching here means new User was created: ", data);
                  return res.send(data);
                 
                })
                 .catch(error => {
                        console.log("Error: ", error);
                        return res.json({
                            success: false,
                            error: error.message || error
                        });    
                    });
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
      
exports.viewCompany = function(req, res, next){
    console.log("Reached viewCompany route!");
    console.log("Company is: ", req.body.name);
    
    var company = req.body.name;
    
    db.companies.findByName({
        Name: company
    })
    .then(data => {
        for(obj in data){
           console.log("This is viewCompany data: ", data);
       }
        console.log("Data: ", data[0].latitude);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });

};      

exports.viewNotification = function(req, res, next){
    console.log("Reached viewNotification route!");
    console.log("Company is: ", req.body.company);
    
    var company = req.body.company;
    
    db.notifications.findByCompany({
        Company: company
    })
    .then(data => {
        for(obj in data){
           console.log("This is viewNotification data: ", data);
       }
        //console.log("Data: ", data[1].text);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });   

};  

exports.deleteNotification = function(req, res, next){  
    console.log("Reached deleteNotifcation route!");
    console.log("Notifications to delete: ", req.body.notifications);
    
    db.notifications.deleteMultiple(
        req.body.notifications
    )
    .then(data => {
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });
};    
      
exports.viewPoles = function(req, res, next){
    console.log("Reached viewPoles route!");
    console.log("Company is: ", req.body.company);
    
    var company = req.body.company;
    
    db.poles.findByCompany({
        Company: company
    })
    .then(data => {
        for(obj in data){
           console.log("This is viewPoles data: ", data);
       }
        console.log("Data: ", data[1].temperature);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });   

};



exports.updatePoleLed = function(req, res, next){
   console.log("Reached updatePole route!");
    console.log("MAC ADDR is: ", req.body.xbee_mac_addr);
    console.log("Led value TO CHANGE : ", req.body.led);
    var ledValue;
    
    switch(req.body.led){
        case 'On':
            ledValue = 1;
            break;
        case 'Off': 
            ledValue = 0;
            break;
        case 'Automatic': 
            ledValue = 2;
            break;
        default:
            ledValue = 0;
            
    }
    
    var digiRoute = 'http://developer.idigi.com/ws/sci';
    var setBrightness =  '00:13:a2:00:40:f5:d8:52! set_main_light_status:' + ledValue ;
    var xmlData = '<sci_request version="1.0">' + "\n" + 
                                                '<send_message synchronous="True">' + "\n" +
                                                '<targets>' + "\n" +
                                                '<device id="00000000-00000000-00409DFF-FF78D78D"/>' + "\n" +
                                                '</targets>' + "\n" + 
                                                '<rci_request version="1.1">' + "\n" + 
                                                '<do_command target="rci_callback_command">' + "\n" +
                                                setBrightness + "\n" +
                                                '</do_command>' + "\n" +
                                                '</rci_request>' + "\n" +
                                                '</send_message>' + "\n" +
                                                '</sci_request>';                            
   console.log("XML: ", xmlData);          
    request({
        method: 'POST',
        url: digiRoute,
        headers: {'Content-Type': 'application/xml'},
        body: xmlData
        
    }).auth('Sunlight', 'SunLight1!', true)
    .on('response', function(response){
        console.log("RESPONSE: ", response.statusCode);
        if(response.statusCode == 200){
            
            return res.send({ success: "Successfully updated LED value "  });
            /*
            db.poles.updateBrightness({
                xbee_mac_addr: req.body.xbee_mac_addr,
                brightness_level: req.body.brightness
            })
            .then(data => {
                console.log("Updated brightness data: ", data);
                return res.send({ success: "Successfully updated brightness level of " + req.body.xbee_mac_addr });
            })
            .catch(error => {
                console.log("Error: ", error);
                return res.json({
                    success: false,
                    error: error.message || error
                });
            });   
            */
        }else{
            return res.json({
            success: false,
            error: "Digi Server responded with error"
            });
        }
    });
    /*
    db.poles.updateBrightness({
        xbee_mac_addr: req.body.xbee_mac_addr,
        brightness_level: req.body.brightness
    })
    .then(data => {
        console.log("Updated brightness data: ", data);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });   

  */

};


exports.updatePoleBrightness = function(req, res, next){
   console.log("Reached updatePole route!");
    console.log("MAC ADDR is: ", req.body.xbee_mac_addr);
    console.log("BRIGHTNESS LEVEL TO CHANGE : ", req.body.brightness);
    var digiRoute = 'http://developer.idigi.com/ws/sci';
    var setBrightness =  '00:13:a2:00:40:f5:d8:52! set_max_brightness:' + req.body.brightness ;
    var xmlData = '<sci_request version="1.0">' + "\n" + 
                                                '<send_message synchronous="True">' + "\n" +
                                                '<targets>' + "\n" +
                                                '<device id="00000000-00000000-00409DFF-FF78D78D"/>' + "\n" +
                                                '</targets>' + "\n" + 
                                                '<rci_request version="1.1">' + "\n" + 
                                                '<do_command target="rci_callback_command">' + "\n" +
                                                setBrightness + "\n" +
                                                '</do_command>' + "\n" +
                                                '</rci_request>' + "\n" +
                                                '</send_message>' + "\n" +
                                                '</sci_request>';                            
   console.log("XML: ", xmlData);          
    request({
        method: 'POST',
        url: digiRoute,
        headers: {'Content-Type': 'application/xml'},
        body: xmlData
        
    }).auth('Sunlight', 'SunLight1!', true)
    .on('response', function(response){
        console.log("RESPONSE: ", response.statusCode);
        if(response.statusCode == 200){
            db.poles.updateBrightness({
                xbee_mac_addr: req.body.xbee_mac_addr,
                brightness_level: req.body.brightness
            })
            .then(data => {
                console.log("Updated brightness data: ", data);
                return res.send({ success: "Successfully updated brightness level of " + req.body.xbee_mac_addr });
            })
            .catch(error => {
                console.log("Error: ", error);
                return res.json({
                    success: false,
                    error: error.message || error
                });
            });   
        }else{
            return res.json({
            success: false,
            error: "Digi Server responded with error"
            });
        }
    });
    /*
    db.poles.updateBrightness({
        xbee_mac_addr: req.body.xbee_mac_addr,
        brightness_level: req.body.brightness
    })
    .then(data => {
        console.log("Updated brightness data: ", data);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });   

  */

};

exports.updateUserInfo = function(req, res, next) {
    console.log("Reached updateUserInfo subroutine!");
    const email = req.body.email,
          firstName = req.body.firstName,
          lastName = req.body.lastName,
          password = req.body.password,
          user_id = req.session.user[0].user_id;
    
    var hash;
    
    db.users.findById({
        Id: user_id
    })
    .then(data => {
        console.log("This is data returned from User query: ", data);
        if(data.length == 0){      
            return res.send({ error: 'Email address is already in use.' });
            //return res.status(422).send({ error: 'Email address is already in use.' });
        }else{
            if(password.length > 1){
                hash = bcrypt.hashSync(password);
            }else{
                hash = data[0].password;
            }
            console.log("Updating User info...");
            return db.users.update({
                  First_Name: firstName,
                  Last_Name: lastName,
                  Password: hash,
                  Email: email, 
                  Id: user_id
               })  
               .then(data => {
                  console.log("Reaching here means User info was updated: ", data);
                  req.session.user = data;
                  req.session.user[0].token = req.session.token ;              
                  return res.send({ success: 'Successfully updated user info!' });
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

exports.updateCompanies = function(req, res, next) {
    console.log("Reached updateCompanies subroutine!");
    const updatedName = req.body.updated_name,
        name = req.body.name,
         location = req.body.location,
          longitude = req.body.longitude,
          latitude = req.body.latitude;
          
          console.log("Updated name: ", updatedName);
             
    db.companies.update({
        Updated_name: updatedName,
        Name: name,
        Location: location,
        Longitude: longitude,
        Latitude: latitude
    })
    .then(data => {
        console.log("This is data returned from Companies update query: ", data);
        return res.send({ success: 'Successfully updated company info!' });
       
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });     
    
   
};

exports.addCompanies = function(req, res, next) {
    console.log("Reached addCompanies subroutine!");
    const name = req.body.name,
         location = req.body.location,
          longitude = req.body.longitude,
          latitude = req.body.latitude;
             
    db.companies.insert({
        Name: name,
        Location: location,
        Longitude: longitude,
        Latitude: latitude
    })
    .then(data => {
        console.log("This is data returned from Companies insert query: ", data);
        return res.send({ success: 'Successfully added company to database!' });
       
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });     
    
   
};

exports.addPole = function(req, res, next) {
    console.log("Reached addPole subroutine!");
    const xbee_mac_addr = req.body.xbee_mac_addr,
         company = req.body.company,
          longitude = req.body.longitude,
          latitude = req.body.latitude;
             
    db.poles.insert({
        XBee_MAC_addr: xbee_mac_addr,
        Company: company,
        Longitude: longitude,
        Latitude: latitude
    })
    .then(data => {
        console.log("This is data returned from Poles insert query: ", data);
        return res.send({ success: 'Successfully added Pole to database!' });
       
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });     
    
   
};

exports.viewCompanies = function(req, res, next){
    console.log("Reached viewCompanies route!");
    console.log("Company is: ", req.body.name);
    
    var company = req.body.name;
    
    db.companies.findAll()
    .then(data => {
        for(obj in data){
           console.log("This is Data: ", data);
       }
        console.log("Data[0]: ", data[0]);
        return res.send(data);
    })
    .catch(error => {
        console.log("Error: ", error);
        return res.json({
            success: false,
            error: error.message || error
        });
    });

}; 