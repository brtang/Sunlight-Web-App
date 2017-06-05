
var app = angular.module('myApp', ['countTo', 'rzModule', 'ui.bootstrap','ngMaterial','mdDataTable', 'ngMessages', 'material.svgAssetsCache']);

function Stack(){
 this.stac=new Array();
 
 this.pop=function(){
  return this.stac.pop();
 }
 
 this.push=function(item){
  this.stac.push(item);
 }
 this.empty = function(){
    return this.stac = [];
 }
}


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

app.service('notificationService', function($http, $httpParamSerializer) {

  var fetchNotificationdata = function(company) {
    console.log("Made it to FETCHNOTIFICATIONDATA call" + company);
    var http_data = { company: company };
    var notificationData = $http({
            method: 'POST',
            url: '/client/notification', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $httpParamSerializer(http_data)
        })
        .then(function(res){
            console.log("Response: " + res.data);
            var data = res.data
            var notificationList = [];
            var unread = 0;
            angular.forEach(data, function(item){
                console.log("ITEM IS: ", item.unread);
                notificationList.push({ 'time_stamp':item.time_stamp.substring(0, 10), 'color': item.color, 'alert_type':item.alert_type, 'unread':item.unread, 'text':item.text, 'id': item.notification_id});
                if(item.unread == true){
                    unread++;
                }
            });
            console.log("Unread: " + unread);
            return [notificationList, unread];
            flash.setMessage("Successfully updated!", 'success');
        })
        .catch(function(err){
            flash.setMessage("Error, update was not successful", 'danger');
        });
        
    return notificationData;
   
  };

  return {
    fetchNotificationdata: fetchNotificationdata
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

app.controller('MainController', ['$scope', '$http', '$httpParamSerializer', 'flash', 'userService', 'poleService', 'notificationService', '$mdDialog', '$timeout', function($scope, $http, $httpParamSerializer, flash, userService, poleService, notificationService, $mdDialog, $timeout){
    console.log("Made it to main controller");
    $scope.flashService = flash;
    $scope.poleList = []; 
    $scope.notifcationList = [];
    var brightnessStack = new Stack();
    /*
    $scope.slider_ticks_values_tooltip = {
        value: $scope.button.brightness_level,
        options: {
            ceil: 100,
            floor: 0,
            stepsArray: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            showTicksValues: true,
            ticksValuesTooltip: function (v) {
                return 'Tooltip for ' + v;
            }
        }
    };
    */
    
    $scope.showAlert = function(ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Brightness')
                .textContent('Adjust the brightness level by selecting a value on the slider.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
        );
    };
    
    $scope.showAlertDash = function(ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Dashboard Widgets')
                .textContent('Select a Pole from the dropdown to view their assets.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
        );
    };
    
    var profile = userService.fetchUserdata();     
    profile.then(function(result){
            $scope.profile = result;
            console.log("Profile name: " + $scope.profile.name); 
            
            var poleData = poleService.fetchPoledata($scope.profile.company);
            var notificationData = notificationService.fetchNotificationdata($scope.profile.company);
            poleData.then(function(result){
                console.log("poleData result: ", result);
                $scope.poleList = result;
                $scope.button = result[0];
                $scope.slider_ticks_values_tooltip = {
                    value: $scope.button.brightness_level,
                    options: {
                        ceil: 100,
                        floor: 0,
                        stepsArray: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                        showTicksValues: true,
                        ticksValuesTooltip: function (v) {
                            return 'Tooltip for ' + v;
                        },
                        onEnd: function(){
                            console.log("ON CHANGE: ", $scope.slider_ticks_values_tooltip.value);
                           brightnessStack.push($scope.slider_ticks_values_tooltip.value);
                           $timeout(function(){
                               console.log("POPPED:", brightnessStack.pop());
                                var data = { 'xbee_mac_addr': $scope.button.mac_addr, 
                                            'brightness': $scope.slider_ticks_values_tooltip.value                                         
                                };                              
                                $http({
                                    method: 'POST',
                                    url: '/client/updatePole', 
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
                           }, 1000);
                        }
                    }
                };
            });
            
            notificationData.then(function(result){
                console.log("notificationData result: ", result);
                $scope.notificationList = result[0];
                $scope.unread = result[1];
            });
    });
    
    $scope.changeSelect = function(name){
        $scope.button = name;
         $scope.slider_ticks_values_tooltip = {
                    value: $scope.button.brightness_level,
                    options: {
                        ceil: 100,
                        floor: 0,
                        stepsArray: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                        showTicksValues: true,
                        ticksValuesTooltip: function (v) {
                            return 'Tooltip for ' + v;
                        },
                        onEnd: function(){
                            console.log("ON CHANGE: ", $scope.slider_ticks_values_tooltip.value);
                           brightnessStack.push($scope.slider_ticks_values_tooltip.value);
                           $timeout(function(){
                               console.log("POPPED:", brightnessStack.pop());
                                var data = { 'xbee_mac_addr': $scope.button.mac_addr, 
                                            'brightness': $scope.slider_ticks_values_tooltip.value                                         
                                };                              
                                $http({
                                    method: 'POST',
                                    url: '/client/updatePole', 
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
                           }, 1000);
                        }
                    }
                };
    }
    
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
    };    
    
     $scope.removeNotifications = function(){
            var newDataList=[];
            var deleteList=[];
            $scope.selectedAll = false;
            angular.forEach($scope.notificationList, function(notification){
                if(!notification.selected){
                    newDataList.push(notification);
                }else{
                    deleteList.push(notification.id);
                }
            }); 
            $scope.notificationList = newDataList;
            console.log("DELETE LIST: ", deleteList);
            var data = {
                'notifications': deleteList
            }
            $http({
                method: 'POST',
                url: '/client/deleteNotification', 
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
        };
    
     $scope.checkAll = function () {
        console.log("REACHED CHECKALL", $scope.selectedAll);
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        
        angular.forEach($scope.notificationList, function(notification) {
            notification.selected = $scope.selectedAll;
        });
        
    };  
 
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
           
              
            scope.$watch('poleList', function(newVal, oldValue) {
                if(newVal.length < 1) return;
                var data = newVal;
                console.log("NewVal DATA: ", data);
                angular.forEach(data, function(Object){
                    console.log("NewVal poleList LATITUDE: ", Object.Company);
                    setMarker(map, new google.maps.LatLng(Object.latitude, Object.longitude), Object.mac_addr, Object.mac_addr);
                });
            }, true);
             
        });
       
 
    };    
    
    
    return{
        restrict: 'E',
        template: '<div id="gmaps"></div>',
        replace:true,
        link: link
    };
    
}]);


app.controller('TableController', ['$scope', '$rootScope', '$http', '$httpParamSerializer', 'flash', 'userService', 'companyService', 'poleService', '$mdToast', function($scope, $rootScope, $http, $httpParamSerializer, flash, userService, companyService, poleService, $mdToast){
    $scope.poleList = []; 
    var profile = userService.fetchUserdata();     
    profile.then(function(result){
            $scope.profile = result;
            console.log("Profile name: " + $scope.profile.name); 
            
            var poleData = poleService.fetchPoledata($scope.profile.company);
            poleData.then(function(result){
                console.log("poleData result: ", result);
                $scope.poleList = result;
                var companyData = companyService.fetchCompanydata($scope.profile.company);
                companyData.then(function(result){
                    console.log("Oh shit made it to the end: ", result);
                    $scope.companyLocation = result;     
                });
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

