var express = require('express');
var router = express.Router();
var ctrlEmpleado = require("../controladores/controlador-empleado.js");
//routes are defined in diferent files, routes for empresa are the only one defined here
var articulos_routes = require("./articulos-routes")(router);
var cargos_routes = require("./cargos-routes")(router);
var sucursales_routes = require("./sucursales-routes")(router);
var empleado_routes = require("./empleado-routes")(router);
var rol_routes = require("./rol-routes")(router);
var proveedor_routes = require("./proveedor-routes")(router);

var ctrlEmpresa = require('../controladores/controlador-empresas.js');

// !!!!!! on every restricted route i.e. need's authorization, send in header "authorization" : "bearer token_here"

router
    .route("/empresa")
//    mostrar empresa
//    {
//        devuelve: {
//            exito: [200,"Arreglo Json con todas las empresas activas"],
//            fracaso: [500]
//        },
//        recibe: {}
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpresa.mostrarEmpresas)
//    crear empresa
//    {
//        devuelve: {
//            exito: [201],
//            fracaso: [400,500]
//        },
//        recibe: {
//            _id:["String","obligatorio","palabra que represente el nombre de la empresa"],
//            nombre:["String","obligatorio","nombre oficial de la empresa"]
//        }
//    }
    .post(ctrlEmpleado.authenticate,ctrlEmpresa.crearEmpresa);

router
    .route("/empresa/:idEmpresa")
//    mostrar empresa
//    {
//        devuelve: {
//            exito: [200,"objeto json con empresa especificada"],
//            fracaso: [404,500]
//        },
//        recibe: {
//            _id:["String","obligatorio","palabra que represente el nombre de la empresa"],
//            nombre:["String","obligatorio","nombre oficial de la empresa"]
//        }
//    }
    .get(ctrlEmpleado.authenticate,ctrlEmpresa.mostrarEmpresa)
//    actualizar empresa 
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {
//            nombre:["String","opcional","nombre oficial de la empresa"]
//        }
//    }
    .put(ctrlEmpleado.authenticate,ctrlEmpresa.actualizarEmpresa)
//    borrar empresa 
//     {
//        devuelve: {
//            exito: [204],
//            fracaso: [404,500]
//        },
//        recibe: {}
//    }
    .delete(ctrlEmpleado.authenticate,ctrlEmpresa.borrarEmpresa);





module.exports=router;



