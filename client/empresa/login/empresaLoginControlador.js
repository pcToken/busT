angular.module("mainApp").controller("empresaLoginCtrl", empresaLoginCtrl)
function empresaLoginCtrl($routeParams, $location, $http,autorizacionData, $window, jwtHelper, empresaData) {
    var vm = this;
    vm.empresa = $routeParams.idEmpresa;
    
//    empresaData.existe(vm.empresa).then(function(existe){
//        if(!existe) $location.path("/404");
//    })
    // funcion que llamara el form de login
    vm.ingresar = function() {
        if(vm.login && vm.clave) {
            var usuario = {
                login : vm.login,
                clave : vm.clave
            }
            $http.post('/api/empresa/'+ $routeParams.idEmpresa +'/empleado/login',usuario).then(function(response) {
                if(response.status==200){
                    $window.sessionStorage.token = response.data.token;
                    autorizacionData.tieneAutorizacion = true;
                    autorizacionData.empresa = $routeParams.idEmpresa;
                    var token = $window.sessionStorage.token;
                    vm.usuario = jwtHelper.decodeToken(token).login;
                    console.log("login autorizado : ", usuario.login);
                    console.log("EN AUTORIZACIONDATA", autorizacionData.tieneAutorizacion);
                    $location.path("/"+ $routeParams.idEmpresa);
                }
            }).catch(function(err) {
                console.log("error loginController.login: ",err);
            });
        }
    }
    vm.logout = function() {
        console.log("LOGOUT");
        delete $window.sessionStorage.token;
        autorizacionData.tieneAutorizacion = false;
        autorizacionData.empresa = "";
        $location.path('/'+$routeParams.idEmpresa+"/login");
    }

}