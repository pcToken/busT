var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var ctrlProveedor = require("../controladores/controlador-proveedor.js");

module.exports = function(router){
    router
        .route("/empresa/:idEmpresa/proveedor")
    //get proveedores
//    {
//        returns:{
//            success:[200,"json array of proveedor"],
//            fail:[403,500]
//        },
//        receives:{
//            
//        }
//    }
        .get(ctrlEmpleado.authenticate,ctrlProveedor.getProveedores)
    //create proveedores
//    {
//        devuelve:{
//            success:[201,proveedor json object],
//            fail:[]
//        },
//        recibe:{
//            "nombre":["String","obligatory"],
//            "abreviatura":["String","optional"],
//            "nombreFactura":["String","optional"],
//            "nit":["String","optional"],
//            "fechaRegistro":["String","optional","actual date and time, not specified by the user, specified by front end","format MM/DD/YYYY"],
//            "nombresContacto":["String","optional","names of preoveedores separated with ; e.g. julio;Mario"],
//            "cargosContacto":["String","optional","contact's cagos separated by ; e.g. contador;encargado de almacen"],
//            "correosContacto":["String","optional","contact's emails separated by ; e.g. julio@gmail.com;mario@gmail.com"],
//            "celularesContacto":["String","optional","contact's cellphone numbers, separated by ; e.g. 7083482;6095839"],
//            "telefonosContacto":["String","optional","contact's telephone numbers separated by ; e.g. 344929;3495829"],
//            "nombresDirecciones":["String","optional","contact's addresses's names separated by ; e.g. casa matriz;sucursal 1"],
//            "paisesDirecciones":["String","optional","contact's addresses's country separated by ; e.g. Bolivia;Chile",available countries specified in server/api/data/enums.js],
//            "ciudadesDirecciones":["String","optional","contact's addresses's city separated by ; e.g. Santa Cruz;Santiago",available cities specified in server/api/data/enums.js],
//            "callesDirecciones":["String","optional","contact's addresses separated by ; e.g. calle 4;calle 5"],
//            "referenciasDirecciones":["String","optional","contact's adresses's  references separated by ; e.g. frente al palacio;por el parque"],
//            "longsDirecciones":["number","optional","adresses's longitudes separated by ; e.g. 1,1231;1,12312"],
//            "latsDirecciones":["number","optional","adresses's latitudes separated by ; e.g. 1,1231;1,12312"],
//            "idPropioArticulos":["String with objectIds","optional","articulos ids(objectids) separated by ;  e.g. 12joiasn12Njs9;819212n3lknlKkK"],
//            "idProveedorArticulos":["String","optional","articulos ids as they are registered by the provider(proveedor) e.g. sk430;tu890"]
//        }
//    }
        .post(ctrlEmpleado.authenticate, ctrlProveedor.createProveedor);
    router
        .route("/empresa/:idEmpresa/proveedor/completo")
    //get proveedores
//    {
//        returns:{
//            success:[200,"proveedores json array including non active ones "],
//            fail:[403,500]
//        },
//        receives:{
//            
//        }
//    }
    .get(ctrlEmpleado.authenticate, ctrlProveedor.getProveedoresCompleto);
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor")
    // get proveedor
//    {
//        returns:{
//            success:["200","proveedor json object"],
//            fail:["404,500"]
//        },
//        receives:{
//        }
//    }
    .get(ctrlEmpleado.authenticate, ctrlProveedor.getProveedor)
    //update proveedor
//    {
//        returns:{
//            success:["204"],
//            fail:["400,404,500"]
//        },
//        receives:{
//            "nombre":["String","optional"],
//            "abreviatura":["String","optional"],
//            "nombreFactura":["String","optional"],
//            "nit":["String","optional"]
//        }
//    }
    .put(ctrlEmpleado.authenticate, ctrlProveedor.updateProveedor)
    //delete proveedor
//    {
//        returns:{
//            success:["204"],
//            fail:["404,500"]
//        },
//        receives:{
//        }
//    }
    .delete(ctrlEmpleado.authenticate, ctrlProveedor.deleteProveedor);
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor/contacto")
    //add contacto
//    {
//        returns:{
//            success:["201",proveedor json object],
//            fail:["404,500,400"]
//        },
//        receives:{
//            "nombre":["String","obligatory"],
//            "cargo":["String","optional"],
//            "correo":["string","optional"],
//            "celulares":["String","optional","celular numbers separated by ;"],
//            "telefonos":["String","optional","telephone numbers separated by ;"]
//        }
//    }
        .post(ctrlEmpleado.authenticate, ctrlProveedor.addContacto);
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor/contacto/:idContacto")
    //update contacto
//    {
//        returns:{
//            success:["204"],
//            fail:["404,500,400"]
//        },
//        receives:{
//            "nombre":["String","optional"],
//            "cargo":["String","optional"],
//            "correo":["string","optional"],
//            "celulares":["String","optional","celular numbers separated by ;"],
//            "telefonos":["String","optional","telephone numbers separated by ;"]
//        }
//    }
    .put(ctrlEmpleado.authenticate, ctrlProveedor.updateContacto)
    //delete contacto
//    {
//        returns:{
//            sucess:["204"],
//            fail:["404,500"]
//        },
//        receives:{
//        }
//    }
    .delete(ctrlEmpleado.authenticate, ctrlProveedor.deleteContacto);
    
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor/direccion")
    //add direccion
//    {
//        returns:{
//            success:["201",proveedor json object],
//            fail:["404,500,400"]
//        },
//        receives:{
//            "nombre":["String","obligatory"],
//            "pais":["String","optional", available countries specified in server/api/data/enums.js],
//            "ciudad":["string","optional",available cities specified in server/api/data/enums.js],
//            "calle":["String","optional", e.g. calle buganvillas],
//            "referencia":["String","optional","e.g. al frente de la UCEBOL"],
//            "longitude":["String","optional","e.g. -1.231", always add both longitude and latitude],
//            "latitude":["String","optional","e.g. -63.123"]
//        }
//    }
        .post(ctrlEmpleado.authenticate, ctrlProveedor.addDireccion);
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor/direccion/:idDireccion")
    //update direccion
//    {
//        returns:{
//            success:["204"],
//            fail:["404,500,400"]
//        },
//        receives:{
//            "nombre":["String","optional"],
//            "pais":["String","optional", available countries specified in server/api/data/enums.js],
//            "ciudad":["string","optional",available cities specified in server/api/data/enums.js],
//            "calle":["String","optional", e.g. calle buganvillas],
//            "referencia":["String","optional","e.g. al frente de la UCEBOL"],
//            "longitude":["String","optional","e.g. -1.231" always add both longitude and latitude],
//            "latitude":["String","optional","e.g. -63.123"]
//        }
//    }
    .put(ctrlEmpleado.authenticate, ctrlProveedor.updateDireccion)
    //delete direccion
//    {
//        returns:{
//            sucess:["204"],
//            fail:["404,500"]
//        },
//        receives:{
//        }
//    }
    .delete(ctrlEmpleado.authenticate, ctrlProveedor.deleteDireccion);
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor/producto")
    //add producto
//    {
//        returns:{
//            success:["201",proveedor json object],
//            fail:["404,500,400"]
//        },
//        receives:{
//            "idArticulo":["ObjectId as String","obligatory"],
//            "idArticuloProveedor":["String","optional",articulo's id as it is registered by the provider]
//        }
//    }
        .post(ctrlEmpleado.authenticate, ctrlProveedor.addProducto);
    router
    .route("/empresa/:idEmpresa/proveedor/:idProveedor/producto/:idProducto")
    //update producto
//    {
//        returns:{
//            success:["204"],
//            fail:["404,500,400"]
//        },
//        receives:{
//            "idArticulo":["ObjectId as String","optional"],
//            "idArticuloProveedor":["String","optional",articulo's id as it is registered by the provider]
//        }
//    }
    .put(ctrlEmpleado.authenticate, ctrlProveedor.updateProducto)
    //delete producto
//    {
//        returns:{
//            sucess:["204"],
//            fail:["404,500"]
//        },
//        receives:{
//        }
//    }
    .delete(ctrlEmpleado.authenticate, ctrlProveedor.deleteProducto);
}
