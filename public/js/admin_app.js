
var app = angular.module('adminApp', []);

myApp.controller('MasterDetailCtrl',
    function ($scope, $http) {

        //  We'll load our list of Customers from our JSON Web Service into this variable
        $scope.listOfCustomers = null;

        //  When the user selects a "Customer" from our MasterView list, we'll set the following variable.
        $scope.selectedCustomer = null;

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
            });
    
        $scope.selectCustomer = function (val) {
            //  If the user clicks on a <div>, we can get the ng-click to call this function, to set a new selected Customer.
            $scope.selectedCustomer = val.CustomerID;
            $scope.loadOrders();
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
    });


