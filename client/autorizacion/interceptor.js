angular.module('mainApp').factory("interceptorAutorizacion",interceptorAutorizacion);

function interceptorAutorizacion($location, $q, $window, autorizacionData, $routeParams, jwtHelper){
    return {
        request : request,
        response: response,
        responseError: responseError
    };
    function request(config){
        config.headers = config.headers || {};
        if($window.sessionStorage.token){
            config.headers.autorizacion = "Bearer " + $window.sessionStorage.token;
        }
        return config;
    }
    function response(response){
        //volviendo a dar autorizacion en caso de que se reinicie la pagina
        if(response.status == 200 && $window.sessionStorage.token && !autorizacionData.tieneAutorizacion){
            autorizacionData.tieneAutorizacion = true;
            autorizacionData.empresa = jwtHelper.decodeToken($window.sessionStorage.token).idEmpresa;
            console.log(autorizacionData.empresa);
        }
        //verificando si empleado es de la empresa indicada en el URL
        if(autorizacionData.empresa != $routeParams.idEmpresa) $location.path("/" + $routeParams.idEmpresa + "/login");
        return response || $q.when(response);
    }
    function responseError(rejection) {
        if(rejection.status == 401 || rejection.status == 403) {
            delete $window.sessionStorage.token;
            autorizacionData.tieneAutorizacion = false;
            $location.path("/"+ $routeParams.idEmpresa + "/login");
        }
        
        return $q.reject(rejection);
    }
}