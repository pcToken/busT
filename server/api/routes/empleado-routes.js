var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var ctrlRol = require("../controladores/controlador-rol.js");
module.exports = function(router){
    router
        .route("/empresa/:idEmpresa/empleado")
    //    crear empleado
    //     {
    //        devuelve: {
    //            exito: [201],
    //            fracaso: [400,500]
    //        },
    //        recibe: {
    //            nombre:["String","obligatorio"],
    //            cargo:["String","opcional"],
    //            login:["String","obligatorio"],
    //            clave:["String","obligatorio"],
    //            sucursal:["String","opcional"],
    //            celular:["String","opcional"],
    //            email:["String","opcional"],
    //            direccion:["String","opcional"],
    //            sexo:["String","opcional"],
    //            fechaNacimiento:["String","opcional","formato MM/DD/YYYY"],
    //            dias:["String","opcional"],
    //            horarios:["String","opcional"]
    //        }
    //    }
        .post(ctrlEmpleado.crearEmpleado)
    //    mostrar empleados
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todos los empleados activos de una empresa"],
    //            fracaso: [500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleados);
    router
        .route("/empresa/:idEmpresa/empleado/completo")
    //    mostrar empleados
    //     {
    //        devuelve: {
    //            exito: [200,"Arreglo json con todos los empleados activos de una empresa incluyendo los no activos"],
    //            fracaso: [500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleadosCompleto);

    router
        .route("/empresa/:idEmpresa/empleado/login")
    //    login
    //     {
    //        devuelve: {
    //            exito: [200,"objeto json con token de autorizacion {token: "12312nkjadsf"}],
    //            fracaso: [500,401,404]
    //        },
    //        recibe: {
    //            login: ["String","obligatorio"],
    //            clave: ["String","obligatorio"]
    //        }
    //    }
        .post(ctrlEmpleado.login);

    router
        .route("/empresa/:idEmpresa/empleado/:idEmpleado")
    //    mostrar empleado
    //     {
    //        devuelve: {
    //            exito: [200,"objeto json"],
    //            fracaso: [500,404,400]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.mostrarEmpleado)
    //    actualizar empleado
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [404,500]
    //        },
    //        recibe: {
    //            nombre:["String","opcional"],
    //            cargo:["String","obligatorio"],
    //            login:["String","opcional"],
    //            clave:["String","opcional"],["String","opcional"],
    //            sucursal:["String","opcional"],
    //            celular:["String","opcional"],
    //            email:["String","opcional"],
    //            direccion:["String","opcional"],
    //            sexo:["String","opcional"],
    //            fechaNacimiento:["String","opcional","formato MM/DD/YYYY"],
    //            dias:["String","opcional"],
    //            horarios:["String","opcional"]
    //        }
    //    }
        .put(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.actualizarEmpleado)
    //    crear empleado
    //     {
    //        devuelve: {
    //            exito: [200],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlEmpleado.authenticate,ctrlEmpleado.borrarEmpleado);

    router
        .route("/empresa/:idEmpresa/empleado/:idEmpleado/rol")
    //    crear empleado
    //     {
    //        devuelve: {
    //            exito: [200,"objeto json empleado al que se agrego el rol"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {
    //            idEmpleado:["String","obligatorio"],
    //            rol:["String","obligatorio","String on los objectId de os roles separados por ;"]
    //        }
    //    }
        .post(ctrlEmpleado.authenticate,ctrlEmpleado.agregarRol)

    //    borrar rol de un empleado
    //     {
    //        devuelve: {
    //            exito: [204],
    //            fracaso: [500,404]
    //        },
    //        recibe: {
    //            rol:["string","obligatorio","String on los objectId de os roles separados por ; de los roles a borrar"]
    //        }
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlEmpleado.borrarRol);

}