/* Scott's stuff */
var app = angular.module('myApp', ['ngRoute', 'firebase']);

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

app.factory("flash", function($rootScope) {

  var currentMessage = "Hello world";
  
  
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

app.controller('MainController', ['$scope', '$http', '$httpParamSerializer', 'flash', function($scope, $http, $httpParamSerializer, flash){
    console.log("Made it to Main controller!");
      $scope.flashService = flash;
    $http.get('/user').then(function(res, err){ 
        var name = String(res.data.first_name) + " " + String(res.data.last_name);
        var email = String(res.data.email);
        var company = String(res.data.company);
        $scope.company = company;
        $scope.email = email;
        var token = String(res.data.token);
        $scope.token = token;
        console.log("Token: " + String(res.data.token)); 
        $http.defaults.headers.common.Authorization = "JWT " + token;
        $scope.profile = {
            firstName: String(res.data.first_name),
            lastName: String(res.data.last_name),
            email: email,
            company: company,
            password: ''
        }
        return $scope.name = name;})
        
    $scope.saveUser = function() {
      
        console.log("Made it to saveUser!");
        var data = { 'email': $scope.profile.email, 
                     'lastName': $scope.profile.lastName,
                     'firstName': $scope.profile.firstName,
                     'password': $scope.profile.password
                    }
        var token = $scope.token;
        console.log("Save user token: " + token);
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
