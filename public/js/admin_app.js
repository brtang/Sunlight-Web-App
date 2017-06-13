
var app = angular.module('adminApp', []);

app.service('userService', function($http) {

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

app.service('poleService', function($http, $httpParamSerializer) {

  var fetchPoledata = function(company) {
    console.log("Made it to FETCHPOLEDATA call" + company);
    var http_data = { company: company };
    var poleData = $http({
        method: 'POST',
        url: '/client/poles', 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: $httpParamSerializer(http_data)
    }).then(function(res){
        console.log("Response: " + res.data);
        var data = res.data;
        var poleList = [];
        angular.forEach(data, function(item){
            console.log("ITEM IS: ", item);
            poleList.push({ 'mac_addr':item.xbee_mac_addr, 'group': item.group_name, 'batt_volt':item.batt_volt, 'panel_volt':item.panel_volt, 'battery_current':item.batt_current, 'panel_current': item.panel_current, 'latitude':item.latitude, 'longitude':item.longitude, 'temp': item.temperature, 'brightness_level':item.brightness_level});
        });
        return poleList;
        //flash.setMessage("Successfully updated!", 'success');
    })
    .catch(function(err){
        flash.setMessage("Error, update was not successful", 'danger');
    });       
    return poleData;  
  };

  return {
    fetchPoledata: fetchPoledata
  };

});

app.controller('MasterDetailCtrl', ['$scope', '$http', '$httpParamSerializer', 'userService', 'companyService',
    function ($scope, $http, $httpParamSerializer, userService, companyService) {
        
        $scope.selectedCompany = null;
        
        var profile = userService.fetchUserdata();    
        profile.then(function(result){
            $scope.profile = result;
            console.log("data.name" + $scope.profile.name); 
        });
        
        var companies = companyService.fetchCompanydata();
        companies.then(function(result){
            $scope.listOfCompanies = result;
             $scope.selectedCompany = $scope.listOfCompanies[0];
        });
        
        $scope.selectCompany = function (val) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
            console.log("SELECT COMPANY NAME: ", val.num_poles);
            $scope.selectedCompany = val;
            //$scope.loadOrders();
        }

        $scope.loadOrders = function () {
            //  Reset our list of orders  (when binded, this'll ensure the previous list of orders disappears from the screen while we're loading our JSON data)
            $scope.listOfOrders = null;

            //  The user has selected a Customer from our Drop Down List.  Let's load this Customer's records.
            $http.get('http://inorthwind.azurewebsites.net/Service1.svc/getBasketsForCustomer/' + $scope.selectedCustomer)
                    .success(function (data) {
                        $scope.listOfOrders = data.GetBasketsForCustomerResult;
                    })
                    .error(function (data, status, headers, config) {
                        $scope.errorMessage = "Couldn't load the list of Orders, error # " + status;
                    });
        }
        
    }]);


