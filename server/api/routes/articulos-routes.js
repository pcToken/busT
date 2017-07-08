var ctrlArticulo = require('../controladores/controlador-articulos.js');
var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var multer = require("multer");
var upload= multer({ dest: './uploads/'});
module.exports = function(router){
    /////////////////////////////////////////////////////////////////////////////
    router
        .route('/empresa/:idEmpresa/articulo')
    //    mostrar todos los articulos
    //    {
    //        devuelve: {
    //            exito: [200,"Arreglo Json con todos los articulos activos"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulos)
        // crea articulo:
    //    {
    //        devuelve: {
    //            exito: [201],
    //            fracaso: [400,500,404]
    //        },
    //        recibe: {
    //            codigo : ["String","obligatorio"],
    //            nombre : ["String","obligatorio"],
    //            precio:["Numero","obligatorio"],
    //            moneda:["String","obligatorio","monedas posibles definidas en el modelo"],
    //            stock:["Numero","obligatorio"],
    //            fotos : ["Arreglo de fotos(binarios)", "opcional"],
    //            nombresFotos: ["String","opcional,obligatorio si envia fotos", "nombres de las fotos separados por ; ej: gatito.jpg;perrito.jpg"],
    //            descripcionesFotos: ["String","opcional,obligatorio si envia fotos"],
    //            enlaces: ["String","opcional","enlaces del articulo separados por ; ej: http://www.google.com;http://www.facebook.com"],
    //            caracteristica:["String","opcional","breve descripcion del articulo"],
    //            embalaje:["String","opcional","define si es articulo o paquete u otra forma(formas posibles definidas en el modelo)"],
    //            cantidadPorPaquete:["Entero","opcional","indica que cantidad de de articulos vienen dentro en caso de ser necesario"],
    //            clasificacion:["objeto json","opcional"],
    //            padre:["String","opcional","codigo del articulo padre"]
    //        }
    //    }
        .post(ctrlEmpleado.authenticate,upload.array("fotos"), ctrlArticulo.crearArticulo);
    /////////////////////////////////////////////////////////////////////////////
    router
        .route('/empresa/:idEmpresa/articulo/completo')
    //    mostrar todos los articulos completo
    //    {
    //        devuelve: {
    //            exito: [200,"Arreglo Json con todos los articulos incluyendo los no activos"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulosCompleto);
    /////////////////////////////////////////////////////////////////////////////
    router
        .route("/empresa/:idEmpresa/articulo/:codigoArticulo")
    //    mostrar un articulo
    //    {
    //        devuelve: {
    //            exito: [200,"objeto json con articulo especificado en los parametros del URL"],
    //            fracaso: [404,500]
    //        },
    //        recibe: {}
    //    }
        .get(ctrlEmpleado.authenticate,ctrlArticulo.mostrarArticulo)
    //actualizar articulo
    //    {
    //        devuelve: {
    //            exito: [204,""],
    //            fracaso: [404,500]
    //        },
    //        recibe: {
    //            codigo : ["String","opcional"],
    //            nombre : ["String","opcional"],
    //            enlaces: ["String","opcional","enlaces del articulo separados por ; ej: http://www.google.com;http://www.facebook.com"],
    //            caracteristica:["String","opcional","breve descripcion del articulo"],
    //            embalaje:["String","opcional","define si es articulo o paquete u otra forma(formas posibles definidas en el modelo)"],
    //            cantidadPorPaquete:["Entero","opcional","indica que cantidad de de articulos vienen dentro en caso de ser necesario"],
    //            precio:["Numero","opcional"],
    //            moneda:["String","opcional","monedas posibles definidas en el modelo"],
    //            stock:["Numero","opcional"],
    //            clasificacion:["objeto json","opcional"],
    //            padre:["String","opcional","codigo del articulo"]
    //        }
    //    }
        .put(ctrlEmpleado.authenticate,ctrlArticulo.actualizarArticulo)
    //    borrar articulo
    //    {
    //        devuelve:{
    //            exito: [204],
    //            fracaso:[404,500];
    //        },
    //        recibe:{}
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlArticulo.borrarArticulo);
    /////////////////////////////////////////////////////////////////////////////
    router
        .route("/empresa/:idEmpresa/articulo/:codigoArticulo/foto")
    //    agregar fotos
    //    {
    //        devuelve:{
    //            exito:[204],
    //            fracaso[500,400]
    //        },
    //        recibe:{
    //            fotos : ["Fotos bajo el mismo fieldname 'fotos'", "opcional"],
    //            nombresFotos: ["String","opcional,obligatorio si envia fotos", "nombres de las fotos separados por ; ej: gatito.jpg;perrito.jpg"],
    //            descripcionesFotos: ["String","opcional,obligatorio si envia fotos"],
    //        }
    //    }
        .post(ctrlEmpleado.authenticate,upload.array("fotos"),ctrlArticulo.agregarFotos)
    //    borrar fotos
    //    {
    //        devuelve:{
    //            exito:[204],
    //            fracaso:[500,404,400]
    //        },
    //        recibe:{
    //            idFotos:["String","obligatorio","string con los id de las fotos que se desea borrar separados por ;"]
    //        }
    //    }
        .delete(ctrlEmpleado.authenticate,ctrlArticulo.borrarFotos);
    /////////////////////////////////////////////////////////////////////////////
    
}