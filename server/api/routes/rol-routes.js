var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var ctrlRol = require("../controladores/controlador-rol.js");

module.exports = function(router){
    router
        .route("/empresa/:idEmpresa/rol")
    //    crear rol
    //     {
    //        devuelve: {
    //            exito: [201],
    //            fracaso: [500,400]
    //        },
    //        recibe: {
    //            nombre:["String","obligatorio"]
    //        }
    //    }
        .post(ctrlEmpleado.authenticate,ctrlRol.crearRol)
    //    mostrar roles
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todos los roles activos de una empresa"],
    //            fracaso: [500,400]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRoles);
    router
        .route("/empresa/:idEmpresa/rol/completo")
    //    mostrar roles
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todos los roles activos de una empresa incluyendo los no activos"],
    //            fracaso: [500,400]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRolesCompleto);

    router
        .route("/empresa/:idEmpresa/rol/:idRol")
    //    actualizar rol
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [500,400,404]
    //        },
    //        recibe: {
    //            nombre:["String","opcional"],
    //            activo:["Boolean","opcional"]
    //        }
    //    }
        .put(ctrlEmpleado.authenticate,ctrlRol.actualizarRol)
    //    borrar rol
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [500,400,404]
    //        },
    //        recibe: {}
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlRol.borrarRol)
    //    mostrar rol
    //     {
    //        devuelve: {
    //            exito: [200,"objeto json del rol"],
    //            fracaso: [500,400,404]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlRol.mostrarRol);

}