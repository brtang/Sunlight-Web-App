
var app = angular.module('adminApp', []);


app.factory("flash", function($rootScope) {
   
  $rootScope.flash = {
                message: "",
                type: 'success', 
   };  
    
  return {
    setMessage: function(message, type) {
      $rootScope.flash = {
                message: message,
                type: type              
      };  
    },
    isMessage: function(){
        if($rootScope.flash.message == ""){
            return false;
        }else{
            return true;
        }
    }
  };
  
});

app.service('profileService', function($http) {

  var fetchUserdata = function() {
  console.log("Made it to FETCHUSERDATA call" );
    var userData = $http.get('/user').then(function(res, err){ 
        console.log("Made it to HTTP call");
        name = String(res.data.first_name) + " " + String(res.data.last_name);
        email = String(res.data.email);
        company = String(res.data.company); 
        token = String(res.data.token);    
        $http.defaults.headers.common.Authorization = "JWT " + token;
        var profile = {
            firstName: String(res.data.first_name),
            lastName: String(res.data.last_name),
            name: name,
            email: email,
            company: company, 
            token: token,
            password: ''
        };
        console.log("Profile: ", profile.name);
        return profile;
    });
    return userData;
   
  };

  return {
    fetchUserdata: fetchUserdata
  };

});


app.service('companyService', function($http, $httpParamSerializer) {

  var fetchCompanydata = function(company) {
    console.log("Made it to FETCHCOMPANYDATA call" + company);
    var http_data = { name: company };  
    var companyData = $http({
            method: 'GET',
            url: '/admin/company',            
        })
        .then(function(res){
            console.log("Response: " + res.data);
            var data = res.data
            var list = [];
            angular.forEach(data, function(item){
                console.log(item);
               
                list.push(item);
            });
            console.log("List from Compnay service: ", list); 
            return list;
           // flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            //flash.setMessage("Error, update was not successful", 'danger');
        });
        
    return companyData;
   
  };

  return {
    fetchCompanydata: fetchCompanydata
  };

});


app.service('userService', function($http, $httpParamSerializer) {

  var fetchUserdata = function(company) {
    console.log("REACHED USER SERVICE");
    var userData = $http({
            method: 'GET',
            url: '/admin/users',            
        })
        .then(function(res){
            var data = res.data
            var list = [];
            angular.forEach(data, function(item){
                list.push(item);
            });
            console.log("List from Users service: ", list); 
            return list;
           // flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            //flash.setMessage("Error, update was not successful", 'danger');
        });
        
    return userData;
   
  };

  return {
    fetchUserdata: fetchUserdata
  };

});

app.service('poleService', function($http, $httpParamSerializer) {

  var fetchPoledata = function() {
    console.log("REACHED POLE SERVICE");
    var poleData = $http({
            method: 'GET',
            url: '/admin/poles',            
        })
        .then(function(res){
            var data = res.data
            var list = [];
            angular.forEach(data, function(item){
                list.push(item);
            });
            console.log("List from Pole service: ", list); 
            return list;
           // flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            //flash.setMessage("Error, update was not successful", 'danger');
        });
        
    return poleData;
   
  };

  return {
    fetchPoledata: fetchPoledata
  };

});

app.controller('UsersDetailCtrl', ['$scope', '$http', '$httpParamSerializer', 'profileService', 'userService', 'flash',
    function ($scope, $http, $httpParamSerializer, profileService, userService, flash) {
        
        $scope.selectedCompany = null;
        $scope.isAdd = false;
        $scope.flashService = flash;
        var listOfCompanies = [];
        var listOfUsers =  [];
        
        var profile = profileService.fetchUserdata();    
        profile.then(function(result){
            $scope.profile = result;
            console.log("data.name" + $scope.profile.name); 
        });
        
        var users = userService.fetchUserdata();
        users.then(function(result){
             var currCompany = result[0].company;
             listOfCompanies.push(currCompany);
             var tempArray = [];
             for(var i = 0; i < result.length; i++){
                if(i != result.length - 1){                 
                    if(result[i].company !== currCompany){
                        currCompany = result[i].company;
                        listOfCompanies.push(currCompany);
                        listOfUsers.push(tempArray);
                        tempArray = [];
                        tempArray.push(result[i]);
                    }else{
                        tempArray.push(result[i]);
                    }
                }else{
                    tempArray.push(result[i]);
                    listOfUsers.push(tempArray);
                }
             }
             console.log("LIST OF USERS: ", listOfUsers);
             console.log("LIST OF COMPANIES: ", listOfCompanies);
             $scope.listOfUsers = listOfUsers;
             $scope.listOfCompanies = listOfCompanies;
             $scope.selectedCompany = listOfCompanies[0];
             $scope.selectedCompanyUsers = listOfUsers[0];
           
        });
        
        $scope.selectCompany = function (val, index) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
            console.log(val);
            if(val){
                console.log("$INDEX: ", index);
                $scope.isAdd = false ;
                $scope.selectedCompany = val;
                $scope.selectedCompanyUsers = listOfUsers[index];
            }else{
                console.log("val is undefined");   
                $scope.isAdd = true ;
            }
          
        }
        
          $scope.addAdmin = function () {
            //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
            var data = { 'firstname': $scope.newAdmin.firstname,
                     'lastname': $scope.newAdmin.lastname,
                     'email': $scope.newAdmin.email,
                     'password': $scope.newAdmin.password
                    }

            $http({
                method: 'POST',
                url: '/admin/addAdmin', 
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer(data)
            })
            .then(function(res){
                console.log("Response: " + res);
                if(res.data.success != false){
                    flash.setMessage("Successfully added Admin to database!", 'success');
                }else{
                    flash.setMessage(res.data.error, 'danger');
                }    
            })
            .catch(function(err){
                flash.setMessage("Error, update was not successful", 'danger');
            });       
        }
        
       
       
    }]);

    
    
app.controller('PoleDetailCtrl', ['$scope', '$http', '$httpParamSerializer', 'profileService', 'poleService', 'flash',
    function ($scope, $http, $httpParamSerializer, profileService, poleService, flash) {
        
        $scope.selectedCompany = null;
        $scope.isAdd = false;
        $scope.flashService = flash;
        var listOfCompanies = [];
        var listOfPoles =  [];
        
        var profile = profileService.fetchUserdata();    
        profile.then(function(result){
            $scope.profile = result;
            console.log("data.name" + $scope.profile.name); 
        });
        
        var poles = poleService.fetchPoledata();
        poles.then(function(result){
             var currCompany = result[0].company;
             listOfCompanies.push(currCompany);
             var tempArray = [];
             for(var i = 0; i < result.length; i++){
                if(i != result.length - 1){                 
                    if(result[i].company !== currCompany){
                        currCompany = result[i].company;
                        listOfCompanies.push(currCompany);
                        listOfPoles.push(tempArray);
                        tempArray = [];
                        tempArray.push(result[i]);
                    }else{
                        tempArray.push(result[i]);
                    }
                }else{
                    tempArray.push(result[i]);
                    listOfPoles.push(tempArray);
                }
             }
             console.log("LIST OF POLES: ", listOfPoles);
             console.log("LIST OF COMPANIES: ", listOfCompanies);
             $scope.listOfPoles = listOfPoles;
             $scope.listOfCompanies = listOfCompanies;
             $scope.selectedCompany = listOfCompanies[0];
             $scope.selectedCompanyPole = listOfPoles[0];
           
        });
        
        $scope.selectCompany = function (val, index) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
            console.log(val);
            if(val){
                console.log("$INDEX: ", index);
                $scope.isAdd = false ;
                $scope.selectedCompany = val;
                $scope.selectedCompanyPole = listOfPoles[index];
            }else{
                console.log("val is undefined");   
                $scope.isAdd = true ;
            }
          
        }
        
          $scope.addPole = function () {
            //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
            var data = { 'xbee_mac_addr': $scope.newPole.xbee_mac_addr,
                     'company': $scope.newPole.company,
                     'longitude': $scope.newPole.longitude,
                     'latitude': $scope.newPole.latitude
                    }

            $http({
                method: 'POST',
                url: '/admin/addPole', 
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer(data)
            })
            .then(function(res){
                console.log("Response: " + res);
                if(res.data.success != false){
                    flash.setMessage("Successfully added Pole to database!", 'success');
                }else{
                    flash.setMessage(res.data.error, 'danger');
                }    
            })
            .catch(function(err){
                flash.setMessage("Error, update was not successful", 'danger');
            });       
        }
        
       
       
    }]);



app.controller('MasterDetailCtrl', ['$scope', '$http', '$httpParamSerializer', 'profileService', 'companyService', 'flash',
    function ($scope, $http, $httpParamSerializer, profileService, companyService, flash) {
        
        $scope.selectedCompany = null;
        $scope.isAdd = false;
        $scope.flashService = flash;
        
        var profile = profileService.fetchUserdata();    
        profile.then(function(result){
            $scope.profile = result;
            console.log("data.name" + $scope.profile.name); 
        });
        
        var companies = companyService.fetchCompanydata();
        companies.then(function(result){
            $scope.listOfCompanies = result;
             $scope.selectedCompany = $scope.listOfCompanies[0];
             $scope.updatedName = $scope.selectedCompany.name;
        });
        
        $scope.selectCompany = function (val) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
            console.log(val);
            if(val){
           
            $scope.isAdd = false ;
            $scope.selectedCompany = val;
             $scope.updatedName = $scope.selectedCompany.name;
            }else{
             console.log("val is undefined");   
            $scope.isAdd = true ;
            }
          
        }

        $scope.saveCompany = function () {
            //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
            var data = { 'name': $scope.selectedCompany.name,
                    'updated_name': $scope.updatedName, 
                     'location': $scope.selectedCompany.location,
                     'longitude': $scope.selectedCompany.longitude,
                     'latitude': $scope.selectedCompany.latitude
                    }

            $http({
                method: 'POST',
                url: '/admin/company', 
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer(data)
            })
            .then(function(res){
                console.log("Response: " + res.data.success);
                if(res.data.success != false){
                    flash.setMessage("Successfully updated!", 'success');
                }else{
                    flash.setMessage("Error, update was not successful", 'danger');
                }    
            })
            .catch(function(err){
                flash.setMessage("Error, update was not successful", 'danger');
            });       
        }
        
         $scope.addCompany = function () {
            //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
            var data = { 'name': $scope.newCompany.name,
                     'location': $scope.newCompany.location,
                     'longitude': $scope.newCompany.longitude,
                     'latitude': $scope.newCompany.latitude
                    }

            $http({
                method: 'POST',
                url: '/admin/addCompany', 
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer(data)
            })
            .then(function(res){
                console.log("Response: " + res);
                if(res.data.success != false){
                    flash.setMessage("Successfully added company to database!", 'success');
                }else{
                    flash.setMessage("Error, update was not successful", 'danger');
                }    
            })
            .catch(function(err){
                flash.setMessage("Error, update was not successful", 'danger');
            });       
        }
        
    }]);


