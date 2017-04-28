var signin = angular.module('signin', ['app', 'ui.router']);

/*
signin.config(function($stateProvider) {

    $stateProvider
        .state('main', {
            name: 'main',
            templateUrl: "/modules/signin/sign-up-login-form.html",
            controller: function ($scope, appModel) {
                $scope.signIn = function() {
                    setTimeout(function() {
                        console.log('Mocking a server response for user ' + $scope.userId + ' : ' + $scope.password + ' signin action');
                        appModel.save({ user: { userId: $scope.userId, password: $scope.password }});
                        window.location.href = 'home.html';
                    }, 1000);
                };
            }
        })
});*/

signin.service('loginService', function($http){
    var urlBase = '/login';

    this.login = function (email, password){
        return $http.post(urlBase, {
            'email': email,
            'password': password
        });
        
    };
    
});


signin.controller('signinController', ['$state', 'loginService', '$scope', '$cookieStore', 'appConfig', 'appModel', 'appManager', '$http', function ($state, loginService, $scope, $cookieStore, appConfig, appModel, appManager, $http) {
    appManager.init(appConfig, $cookieStore, $scope, appModel, true);
    //$state.go('main');
   console.log("FUUUUCK");
    $scope.logIn = function(){
        console.log("Email : " +  $scope.formData.emailLogin);
   
        var req = {
            method: 'POST',
            url: '/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
              transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {
                email: $scope.formData.emailLogin,
                password: $scope.formData.passwordLogin
            }        
        };
        $http(req).then(function (response){
            console.log("Result LOGIN!: " + response.data["Success"]);
            console.log("Token: " + response.data["token"]);
        });
        /*
        loginService.login($scope.formData.emailLogin, $scope.formData.passwordLogin).then(function(data){
            console.log("Result LOGIN: " + data);
        });*/
    };
    
    $scope.register = function(){
        console.log("Scope: " + $scope);
    };
}]);