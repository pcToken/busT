angular.module("mainApp").factory("autorizacionData", autorizacionData);
function autorizacionData() {
    return {
        tieneAutorizacion : false,
        empresa:""
    };

}