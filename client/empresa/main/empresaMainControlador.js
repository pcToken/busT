angular.module("mainApp").controller("empresaMainCtrl", empresaMainCtrl);
function empresaMainCtrl(autorizacionData,$location,$routeParams,empresaData){
    //verificando si existe la empresa
    empresaData.existe($routeParams.idEmpresa).then(function(existe){
        if(!existe)$location.path("/404");
    });
}