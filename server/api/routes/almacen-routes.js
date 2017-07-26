var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var multer = require("multer");
var upload= multer({ dest: './uploads/'});
var ctrlAlmacen = require("../controladores/controlador-almacen.js");

module.exports = function(router){
    router.route("/empresa/:idEmpresa/almacen")
    //add almacen
//    {
//        returns:{
//            success:[201,almacen json Object],
//            fail:[400,500]
//        },
//        receives:{
//            nombre:["String","obligatory"],
//            nombreDireccion:["String","optional"],
//            paisDireccion:["String","optional",available countries specified in server/api/data/enums.js],
//            ciudadDireccion:["String","optional",available cities specified in server/api/data/enums.js],
//            calleDireccion:["String","optional"],
//            referencia:["String","optional",e.g. al frente de los pollos chuy],
//            lonitudeDireccion:["number","optional"],
//            latitudeDireccion:["number","optional"]
//        }
//    }
    .post(ctrlEmpleado.authenticate, ctrlAlmacen.addAlmacen)
    //get almacenes
//    {
//        returns:{
//            success:["200","almacenes json array"],
//            fail:["500"]
//        },
//        receives:{
//        }
//    }
    .get(ctrlEmpleado.authenticate, ctrlAlmacen.getAlmacenes)
    
    router.route("/empresa/:idEmpresa/almacen/completo")
    //get almacenes completo
//    {
//        returns:{
//            success:["200","almacenes json array"],
//            fail:["500"]
//        },
//        receives:{
//        }
//    }
    .get(ctrlEmpleado.authenticate, ctrlAlmacen.getAlmacenesCompleto);
    
    router.route("/empresa/:idEmpresa/almacen/:idAlmacen")
      //   get almacen
    //    {
    //        returns:{
    //            success:["200","almacen json object"],
    //            fail:["500"]
    //        },
    //        receives:{
    //        }
    //    }
    .get(ctrlEmpleado.authenticate, ctrlAlmacen.getAlmacen)
    //delete almacen
    //    {
    //        returns:{
    //            success:["204"],
    //            fail:["500","404"]
    //        },
    //        receives:{
    //        }
    //    }
    .delete(ctrlEmpleado.authenticate, ctrlAlmacen.deleteAlmacen)
    //update almacen
//    {
//        returns:{
//            success:[204],
//            fail:[400,500]
//        },
//        receives:{
//            nombre:["String","optional"],
//            nombreDireccion:["String","optional"],
//            paisDireccion:["String","optional",available countries specified in server/api/data/enums.js],
//            ciudadDireccion:["String","optional",available cities specified in server/api/data/enums.js],
//            calleDireccion:["String","optional"],
//            referencia:["String","optional",e.g. al frente de los pollos chuy],
//            lonitudeDireccion:["number","optional"],
//            latitudeDireccion:["number","optional"]
//        }
//    }
    .put(ctrlEmpleado.authenticate, ctrlAlmacen.updateAlmacen);
    
    router.route("/empresa/:idEmpresa/almacen/:idAlmacen/ubicacion")
    // add ubicacion
//    {
//        returns:{
//            sucess:["201","ubicacion json object"],
//            fail:["400","500"]
//        },
//        receives:{
//            nombre:["string","obligatory"],
//            descripcion:["string","optional"],
//            cantidadMaxima:["Number","optional"],
//            padre:["ObjectId ref:Ubicacion","optional"]
//        }
//    }
    .post(ctrlEmpleado.authenticate, ctrlAlmacen.addUbicacion);
    router.route("/empresa/:idEmpresa/almacen/:idAlmacen/ubicacion/:idUbicacion")
    //update ubicacion
//    {
//        returns:{
//            sucess:["201","ubicacion json object"],
//            fail:["400","500"]
//        },
//        receives:{
//            nombre:["string","optional"],
//            descripcion:["string","optional"],
//            cantidadMaxima:["Number","optional"],
//            cantidadActual:["Number","optional"],
//            padre:["ObjectId ref:Ubicacion","optional"]
//        }
//    }
    .put(ctrlEmpleado.authenticate, ctrlAlmacen.updateUbicacion)
    //    delete ubicacion
    //    {
    //        returns:{
    //            success:["204"],
    //            fail:["500","404"]
    //        },
    //        receives:{
    //        }
    //    }
    .delete(ctrlEmpleado.authenticate, ctrlAlmacen.deleteUbicacion);
};