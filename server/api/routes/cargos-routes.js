var ctrlCargo = require("../controladores/controlador-cargo.js");
var ctrlEmpleado = require("../controladores/controlador-empleado.js");
module.exports = function(router){
    router
        .route("/empresa/:idEmpresa/cargo")
    //    mostrar cargos
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todos los cargos activos de la empresa"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargos)
    //    crear cargo
    //     {
    //        devuelve: {
    //            exito: [201],
    //            fracaso: [404,500]
    //        },
    //        recibe: {
    //            esArea:["Boolean","obligatorio","indica si el cargo es un area o un cargo individual"],
    //            nombre:["String","obligatorio"],
    //            padre: ["Object Id","opcional","id del articulo padre, !!!si no se coloca este campo se asume que este cargo sera la cabeza de la empresa!!!"];
    //        }
    //    }
        .post(ctrlEmpleado.authenticate,ctrlCargo.crearCargo);
    router
        .route("/empresa/:idEmpresa/cargo/completo")
    //    mostrar cargos completo
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todos los cargos de la empresa incluyendo los no activos"],
    //            fracaso: [500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargosCompleto);

    router
        .route("/empresa/:idEmpresa/cargo/:idCargo")
    //    mostrar cargo
    //     {
    //        devuelve: {
    //            exito: [200,"objeto json con el cargo especificado"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }    
        .get(ctrlEmpleado.authenticate,ctrlCargo.mostrarCargo)
    //    actualizar cargo
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [404,500]
    //        },
    //        recibe: {
    //            esArea:["Boolean","opcional","indica si el cargo es un area o un cargo individual"],
    //            nombre:["String","opcional"],
    //            activo:["Boolean","opcional","indica si el cargo esta eliminado o activo"],
    //            padre: ["Object Id","opcional","id del articulo padre, si envias 'none' se eliminara el padre"];
    //        }
    //    }
        .put(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlCargo.actualizarCargo)
    //   eliminar cargo
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [404,400,500]
    //        },
    //        recibe: {}
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlCargo.borrarCargo);
}