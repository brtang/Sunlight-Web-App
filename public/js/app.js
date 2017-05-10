/* Scott's stuff */
var app = angular.module('myApp', ['ngMaterial','mdDataTable']);


/*
app.config(function($routeProvider){
  //console.log("Hi" + $scope.logged_in_user);
  $routeProvider
	.when('/', {
		controller: 'MainController',
		templateUrl: 'views/list.html'
	})
	.when('/add', {
		controller: 'AddController',
		templateUrl: 'views/add.html'
	})
	.when('/edit/:id', {
		controller: 'EditController',
		templateUrl: 'views/edit.html'
	
	})
	.otherwise({
		redirectTo: '/'
	});
});


app.constant("FBURL", 
  "https://angular-crud-77eb8.firebaseio.com/" //Use the URL of your project here
); 
*/

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
    var location; 
    var companyData = $http({
            method: 'POST',
            url: '/client/company', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $httpParamSerializer(http_data)
        })
        .then(function(res){
            console.log("Response: " + res.data);
            var data = res.data
            angular.forEach(data, function(item){
                console.log(item);
                console.log(item.latitude);
                location = [ item.latitude, item.longitude];
            });
             
            return location;
            flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            flash.setMessage("Error, update was not successful", 'danger');
        });
        
    return companyData;
   
  };

  return {
    fetchCompanydata: fetchCompanydata
  };

});

app.controller('MainController', ['$scope', '$http', '$httpParamSerializer', 'flash', 'userService', function($scope, $http, $httpParamSerializer, flash, userService){
    console.log("Made it to main controller");
    $scope.flashService = flash;
    var profile = userService.fetchUserdata();    
    profile.then(function(result){
            $scope.profile = result;
         console.log("data.name" + $scope.profile.name); 
    });
    /*Initialize personal header data
    console.log("Made it to set profile: ", profile.name);
    $scope.name = profile.name 
    $scope.email = profile.email;
    $scope.company = profile.company;    
    $scope.token = profile.token;
    $scope.profile = profile;
    */
    
    $scope.saveUser = function() {      
        var data = { 'email': $scope.profile.email, 
                     'lastName': $scope.profile.lastName,
                     'firstName': $scope.profile.firstName,
                     'password': $scope.profile.password
                    }
        var token = $scope.token;
        $http({
            method: 'POST',
            url: '/user', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $httpParamSerializer(data)
        })
        .then(function(res){
            console.log("Response: " + res);
             flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            flash.setMessage("Error, update was not successful", 'danger');
        });
    
        
    }    
 
}]);

app.directive('myMap',['$http', function($http){
    
    var link = function(scope, element, attrs){
        var map, infoWindow, mapOptions;
        var markers = [];
        
        
        scope.$watch('poleList', function(newVal, oldValue) {
            console.log("NewVal Pole list: ", newVal);
            mapOptions = {
            center: new google.maps.LatLng(newVal, -122.0621593),
            zoom : 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        });
        
        /*
        var mapOptions = {
            center: new google.maps.LatLng(36.9982065, -122.0621593),
            zoom : 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        */
        
        function initMap(){
            if(map === void 0){
                map = new google.maps.Map(element[0], mapOptions);
            }
        };
        initMap();
    };    
    
    
    return{
        restrict: 'E',
        template: '<div id="gmaps"></div>',
        replace:true,
        link: link
    };
    
}]);


app.controller('TableController', ['$scope', '$rootScope', '$http', '$httpParamSerializer', 'flash', 'userService', 'companyService', function($scope, $rootScope, $http, $httpParamSerializer, flash, userService, companyService){
    
    var profile = userService.fetchUserdata();   
    $scope.poleList = [];    
    profile.then(function(result){
            $scope.profile = result;
            console.log("data.name" + $scope.profile.name); 
            
            var data = { company: $scope.profile.company };
            $http({
                method: 'POST',
                url: '/client/poles', 
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer(data)
            })
            .then(function(res){
                console.log("Res.data: ", res.data);
                var data = res.data;
                angular.forEach(data, function(item){
                   console.log("item: ", item);   
                   console.log("Group_name: ", item.Group_name);  
                   $scope.poleList.push({ 'mac_addr':item.xbee_mac_addr, 'group': item.group_name, 'batt_volt':item.batt_volt, 'panel_volt':item.panel_volt, 'battery_current':item.batt_current, 'panel_current': item.panel_current, 'latitude':item.latitude, 'longitude':item.longitude});
                });
                var companyData = companyService.fetchCompanydata($scope.profile.company);
                companyData.then(function(result){
                    console.log("Oh shit made it to the end: ", result);
                    
                });
        
            })
            .catch(function(err){
                console.log("Error, update was not successful" + err);
            });
    });
    
            
   $scope.refreshTable = function() {
         $http({
            method: 'GET',
            url: '/client/poles', 
        })
        .then(function(res){
            console.log("Response: " + res);
             //flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            //flash.setMessage("Error, update was not successful", 'danger');
        });
    
    }
}]);

/*
app.directive('myMap', function(){

    var link = function(scope, element, attrs){
        var map, infoWindow;
        var markers = [];
        
        var mapOptions = {
            center: new google.maps.LatLng(36.9982065, -122.0621593),
            zoom : 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        function initMap(){
            if(map === void 0){
                map = new google.maps.Map(element[0], mapOptions);
            }
        }
    };    
    initMap();
    return{
        restrict: 'A',
        template: '<h1 >Hello</h1>',
        replace:true,
        link: link
    };
    
}); */

/*
//My new Angular stuff
var app = angular.module('app', ['ngCookies']);

app.config(function($cookiesProvider) {
    $cookiesProvider.defaults.path = '/';
});

app.factory('appConfig', function () {
    var AppConfig = function () {

    };
    AppConfig.prototype.init = function () {
        return this;
    }
    return new AppConfig();
});

app.factory('appModel', function () {
    var AppModel = function() {

    };
    AppModel.prototype.init = function (storage) {
        this.storage = storage;
        var data = this.storage.get('data');
        if (data != null) {
            this.save(data);
        }
        return this;
    }
    AppModel.prototype.save = function (data) {
        this.data = data;
        this.storage.put('data', data);
    }
    AppModel.prototype.clear = function () {
        this.data = null;
        this.storage.remove('data');
    }
    return new AppModel();
});

app.factory('appManager', function() {

    return {
        init: function (appConfig, $cookieStore, $scope, appModel, shouldClear) {
            $scope.config = appConfig.init();
            var model = appModel.init($cookieStore);
            if (shouldClear == true) {
                model.clear();
            }
            $scope.model = model;
        }
    }
});*/
