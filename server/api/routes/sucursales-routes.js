var ctrlSucursal = require("../controladores/controlador-sucursal.js");
var ctrlEmpleado = require("../controladores/controlador-empleado.js");
module.exports = function(router){
    router
        .route("/empresa/:idEmpresa/sucursal")
    //   crear sucursal
    //     {
    //        devuelve: {
    //            exito: [201],
    //            fracaso: [400,500]
    //        },
    //        recibe: {
    //            nombreSucursal:["String","obligatorio"],
    //            ciudad:["String","opcional"],
    //            direccion:["String","opcional"],
    //            long:["Numero","opcional"],
    //            lat:["Numero","opcional"],
    //            telefono:["String","opcional"],
    //            email:["String","opcional"],
    //            dias:["String","opcional","string con dias separados por ; ej: lunes;martes"]
    //            horarios:["String","opcional","string con horarios separados por ; ej: 8am-12pm;10am-5pm"]
    //        }
    //    }
        .post(ctrlEmpleado.authenticate,ctrlSucursal.crearSucursal)
    //    mostrar sucursales
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todas las sucursales de la empresa"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursales);
    router
        .route("/empresa/:idEmpresa/sucursal/completo")
    //    mostrar sucursales
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todas las sucursales de la empresa incluyendo las no activas"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursalesCompleto);

    router
        .route("/empresa/:idEmpresa/sucursal/:idSucursal")
    //    mostrar sucursales
    //     {
    //        devuelve: {
    //            exito: [200,"objeto json"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlSucursal.mostrarSucursal)
    //   actualizar sucursal
    //     {
    //        devuelve: {
    //            exito: [2014],
    //            fracaso: [400,500]
    //        },
    //        recibe: {
    //            nombreSucursal:["String","opcional"],
    //            ciudad:["String","opcional"],
    //            direccion:["String","opcional"],
    //            long:["Numero","opcional"],
    //            lat:["Numero","opcional"],
    //            telefono:["String","opcional"],
    //            email:["String","opcional"],
    //            dias:["String","opcional","string con dias separados por ; ej: lunes;martes"]
    //            horarios:["String","opcional","string con horarios separados por ; ej: 8am-12pm;10am-5pm"]
    //        }
    //    }
        .put(ctrlEmpleado.authenticate,ctrlSucursal.actualizarSucursal)
    //    borrar sucursal
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlSucursal.borrarSucursal);
}