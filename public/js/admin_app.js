
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
             $scope.selectedCompany = $scope.listOfCompanies[0].name;
        });
        
        //  We'll load our list of Customers from our JSON Web Service into this variable
        //$scope.listOfCompanies = null;

        //  When the user selects a "Customer" from our MasterView list, we'll set the following variable.
     
        
        /*
        $http.get('http://inorthwind.azurewebsites.net/Service1.svc/getAllCustomers')

            .success(function (data) {
                $scope.listOfCustomers = data.GetAllCustomersResult;

                if ($scope.listOfCustomers.length > 0) {

                    //  If we managed to load more than one Customer record, then select the first record by default.
                    //  This line of code also prevents AngularJS from adding a "blank" <option> record in our drop down list
                    //  (to cater for the blank value it'd find in the "selectedCustomer" variable)
                    $scope.selectedCustomer = $scope.listOfCustomers[0].CustomerID;

                    //  Load the list of Orders, and their Products, that this Customer has ever made.
                    $scope.loadOrders();
                }
            })
            .error(function (data, status, headers, config) {
                $scope.errorMessage = "Couldn't load the list of customers, error # " + status;
            }); */
    
        $scope.selectCompany = function (val) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
            console.log("SELECT COMPANY NAME: ", val.name);
            $scope.selectedCompany = val.name;
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


