//set module 
angular.module("mainApp",['ngRoute','angular-jwt']).config(config).run(run);

function config($routeProvider, $httpProvider){
    //interceptor de autorizacion
    $httpProvider.interceptors.push("interceptorAutorizacion");
    $routeProvider
        .when("/404",{
            template:"<h1>NOT FOUND </h1>"
        })
        .when("/:idEmpresa",{
            template: "<h1>MAIN</h1> <button ng-click='vm.logout()'>LOG OUT</button>",
            necesitaAutorizacion: true,
            controller: empresaMainCtrl,
            controllerAs: "vm"
        })
        .when("/:idEmpresa/login",{
            controller: empresaLoginCtrl,
            templateUrl: "empresa/login/empresaLogin.html",
            controllerAs: "vm"
        })
        .otherwise({
        redirectTo: "/404"
    });
}

function run ($rootScope, $location, $window, autorizacionData, empresaData,$routeParams){
    $rootScope.$on("$routeChangeStart", function(event, siguienteRuta, ruta) {
        //verificar la autorizacion respectiva
        if(siguienteRuta.necesitaAutorizacion != undefined && siguienteRuta.necesitaAutorizacion && !$window.sessionStorage.token && !autorizacionData.tieneAutorizacion){
            event.preventDefault();
            $location.path('/'+ siguienteRuta.params.idEmpresa + "/login");
        }
    });
}