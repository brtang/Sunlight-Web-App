/* Scott's stuff */
var app = angular.module('myApp', ['ngRoute', 'firebase']);

app.config(function($routeProvider){
  $routeProvider
	.when('/', {
		controller: 'ListController',
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
