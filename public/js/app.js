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
        
        function initMap(){
            if(map === void 0){
                map = new google.maps.Map(element[0], mapOptions);
            }
        };
        
         function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        
        scope.$watch('companyLocation', function(newVal, oldValue) {
            if(!newVal) return;
            console.log("NewVal companyLocation: ", newVal[1]);
            mapOptions = {
            center: new google.maps.LatLng(newVal[0], newVal[1]),
            zoom : 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true
            };
            initMap();
            
           // setMarker(map, new google.maps.LatLng(36.9982065, -122.0621593), 'UCSC', 'Just some content');
              
        scope.$watch('poleList', function(newVal, oldValue) {
            if(newVal.length < 1) return;
            var data = newVal;
            console.log("NewVal DATA: ", data);
            angular.forEach(data, function(Object){
                console.log("NewVal poleList LATITUDE: ", Object.Company);
                setMarker(map, new google.maps.LatLng(Object.latitude, Object.longitude), Object.mac_addr, Object.mac_addr);
                console.log("MARKER SHOULD AHVE BEEN SET??");
            });
        }, true);
             
        });
       
        /*
        var mapOptions = {
            center: new google.maps.LatLng(36.9982065, -122.0621593),
            zoom : 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        */
        
     
        //initMap();
    };    
    
    
    return{
        restrict: 'E',
        template: '<div id="gmaps"></div>',
        replace:true,
        link: link
    };
    
}]);


app.controller('TableController', ['$scope', '$rootScope', '$http', '$httpParamSerializer', 'flash', 'userService', 'companyService', '$mdToast', function($scope, $rootScope, $http, $httpParamSerializer, flash, userService, companyService, $mdToast){
    
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
                   //$scope.poleList = []; 
                   $scope.poleList.push({ 'mac_addr':item.xbee_mac_addr, 'group': item.group_name, 'batt_volt':item.batt_volt, 'panel_volt':item.panel_volt, 'battery_current':item.batt_current, 'panel_current': item.panel_current, 'latitude':item.latitude, 'longitude':item.longitude, 'temp': item.temperature});
                });
                var companyData = companyService.fetchCompanydata($scope.profile.company);
                companyData.then(function(result){
                    console.log("Oh shit made it to the end: ", result);
                    $scope.companyLocation = result;     
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

