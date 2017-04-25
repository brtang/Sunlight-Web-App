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
    var urlBase = 'Sample-env.kfrmmpzbr7.us-west-2.elasticbeanstalk.com/login';

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
   
    $scope.logIn = function(){
        console.log("Email : " +  $scope.formData.emailLogin);
        var dataObj = {
            email: $scope.formData.emailLogin,
            password: $scope.formData.passwordLogin
        };
        var res = $http.post('ec2-35-160-131-253.us-west-2.compute.amazonaws.com:8080/login', dataObj);
       /* loginService.login($scope.formData.emailLogin, $scope.formData.passwordLogin).then(function(data){
            console.log("Result LOGIN: " + data);
        });*/
    };
    
    $scope.register = function(){
        console.log("Scope: " + $scope);
    };
}]);