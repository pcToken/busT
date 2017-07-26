var ctrlEmpleado = require("../controladores/controlador-empleado.js");
var multer = require("multer");
var upload= multer({ dest: './uploads/'});
var ctrlCompra = require("../controladores/controlador-compra.js")
module.exports = function(router){
    
  router
  .route("/empresa/:idEmpresa/compra")
    //add compra
//    {
//        returns: {
//            success: [201, compra json object],
//            fracaso: [400,500]
//        },
//        receives: {
//            fecha:[String,"obligatory","format MM/DD/YYYY preferably not inserted by the user"],
//            idProveedor:["ObjectId","optional"],
//            importeSinDescuento:["Number","obligatory","amount before discounts"],
//            importe:["Number","obligatory","amount after discounts"],
//            moneda:["String","obligatory","currency", "available currencies specified in server/api/data/enums.js"],
//            montosDescuentos:["array","optional","e.g. [125,34.5]"],
//            conceptosDescuentos:["array","Optional","discount's info"],
//            saldoPago:["Number","obligatory","balance"],
//            estadoPago:["String","optional"],
//            idUsuario:["String", "obligatory","empleado id"],
//            idContacto:["ObjectId","optional","proveedor's contact id"],
//            ,
//            ,
//            ,as you can have more than one pedido in each compra, arrays are used
//            idArticulosPedido:["array","obligatory"," array with objectIds e.g.[1231nj1n23 , 123j12nkj2n3k12]"],
//            idProveedorArticulosPedido:["array","optional", "articulo's id as it is registered by the provider","[12jk ,123jo]"],
//            cantidadesPedido:["array","obligatory","quantities for the orders e.g. [12,34]"],
//            preciosUnitariosPedido:["array","obligatory","price to be paid for each articulo e.g. [14.5 ,56.8]"],
//            importesSinDescuentoPedido:["array","boligatory","e.g. [1500, 1400]"],
//            descuentosPedido:["matrix","optional","each row are discounts for one pedido e.g [[12.4,13.6],[13, 55]]  12.4 and 13.6 are discounts for the first pedido"],
//            conceptosDescuentosPedido:["matrix","optional","each row are discount's concepts for each pedido e.g [["black friday","fidelity"],["yapa", "sale"]]   ],
//            importesPedido:["array","obligatory","amounts after discounts e.g. [14.5 ,56.8]"],
//            monedasPedido:["array","obligatory","currency", "available currencies specified in server/api/data/enums.js"],
//        }
//    }
    .post(ctrlEmpleado.authenticate, ctrlCompra.addCompra)
    //get compras
//    {
//        returns:{
//            success:["200","compras json array"],
//            fail:["500"]
//        },
//        receives:{
//        }
//    }
    .get(ctrlEmpleado.authenticate, ctrlCompra.getCompras);
    


    router.route("/empresa/:idEmpresa/compra/completo").get(ctrlEmpleado.authenticate, ctrlCompra.getComprasCompleto);

    router.route("/empresa/:idEmpresa/compra/:idCompra")
    //   get compra
    //    {
    //        returns:{
    //            success:["200","compras json object"],
    //            fail:["500"]
    //        },
    //        receives:{
    //        }
    //    }
    .get(ctrlEmpleado.authenticate, ctrlCompra.getCompra)
       //update compra
    //    {
    //        returns:{
    //            success:["204"],
    //            fail:["500","400","404"]
    //        },
    //        receives:{
    //            fecha:[String,"optional","format MM/DD/YYYY preferably not inserted by the user"],
    //            idProveedor:["ObjectId","optional"],
    //            importeSinDescuento:["Number","optional","amount before discounts"],
    //            importe:["Number","optional","amount after discounts"],
    //            moneda:["String","optional","currency", "available currencies specified in server/api/data/enums.js"],
    //            montosDescuentos:["array","optional","e.g. [125,34.5]"],
    //            conceptosDescuentos:["array","Optional","discount's info"],
    //            saldoPago:["Number","optional","balance"],
    //            estadoPago:["String","optional"],
    //            idUsuario:["String", "optional","empleado id"],
    //            idContacto:["ObjectId","optional","proveedor's contact id"]
    //        }
    //    }
    .put(ctrlEmpleado.authenticate, ctrlCompra.updateCompra)
        //delete compra
    //    {
    //        returns:{
    //            success:["204"],
    //            fail:["500","404"]
    //        },
    //        receives:{
    //        }
    //    }
    .delete(ctrlEmpleado.authenticate, ctrlCompra.deleteCompra);
    router.route("/empresa/:idEmpresa/compra/:idCompra/pedido")
    // add pedidos
//    {
//        returns: {
//            success: [201, compra json object],
//            fracaso: [400,500,404]
//        },
//        receives: {
//        as you can have more than one pedido in each compra, arrays are used
//            idArticulosPedido:["array","obligatory"," array with objectIds e.g.[1231nj1n23 , 123j12nkj2n3k12]"],
//            idProveedorArticulosPedido:["array","optional", "articulo's id as it is registered by the provider","[12jk ,123jo]"],
//            cantidadesPedido:["array","obligatory","quantities for the orders e.g. [12,34]"],
//            preciosUnitariosPedido:["array","obligatory","price to be paid for each articulo e.g. [14.5 ,56.8]"],
//            importesSinDescuentoPedido:["array","boligatory","e.g. [1500, 1400]"],
//            descuentosPedido:["matrix","optional","each row are discounts for one pedido e.g [[12.4,13.6],[13, 55]]  12.4 and 13.6 are discounts for the first pedido"],
//            conceptosDescuentosPedido:["matrix","optional","each row are discount's concepts for each pedido e.g [["black friday","fidelity"],["yapa", "sale"]]   ],
//            importesPedido:["array","obligatory","amounts after discounts e.g. [14.5 ,56.8]"],
//            monedasPedido:["array","obligatory","currency", "available currencies specified in server/api/data/enums.js"],
//        }
//    }    
        .post(ctrlEmpleado.authenticate, ctrlCompra.addPedidos);
    router.route("/empresa/:idEmpresa/compra/:idCompra/pedido/:idPedido")
    //get pedido
    //    {
    //        returns:{
    //            success:["200","pedido json object"],
    //            fail:["500"]
    //        },
    //        receives:{
    //        }
    //    }
        .get(ctrlEmpleado.authenticate, ctrlCompra.getPedido)
    // Update pedido
//    {
//        returns: {
//            success: [204],
//            fracaso: [400,500,404]
//        },
//        receives: {
//            idArticulo:["ObjectId","optional"," array with objectIds e.g.[1231nj1n23 , 123j12nkj2n3k12]"],
//            idArticuloProveedor:["String","optional", "articulo's id as it is registered by the provider","[12jk ,123jo]"],
//            cantidad:["Number","optional","quantities for the orders e.g. [12,34]"],
//            precioUnitario:["Number","optional","price to be paid for each articulo e.g. [14.5 ,56.8]"],
//            importeSinDescuento:["Number","optional","e.g. [1500, 1400]"],
//            descuentos:["array","optional","each row are discounts for one pedido e.g [[12.4,13.6],[13, 55]]  12.4 and 13.6 are discounts for the first pedido"],
//            conceptosDescuentos:["array","optional","each element are discount's concepts for pedido e.g ["black friday","fidelity"]   ],
//            importe:["number","optional","after discounts e.g. 14.5"],
//            moneda:["String","optional","currency", "available currencies specified in server/api/data/enums.js"],
//        }
//    } 
    .put(ctrlEmpleado.authenticate, ctrlCompra.updatePedido)
    //delete pedido
    //    {
    //        returns:{
    //            success:["204"],
    //            fail:["500","404"]
    //        },
    //        receives:{
    //        }
    //    }
    .delete(ctrlEmpleado.authenticate, ctrlCompra.deletePedido);
    router.route("/empresa/:idEmpresa/compra/:idCompra/pago")
    //add pago
//    {
//        returns:{
//            success: [201, pago json object],
//            fracaso: [400,500]
//        },
//        receives:{
//            fecha:[String,"obligatory","format MM/DD/YYYY preferably not inserted by the user"],
//            importe:["Number","obligatory"],
//            moneda:["String","obligatory","currency", "available currencies specified in server/api/data/enums.js"],
//            saldo:["number","obligatory"],
//            nroNota:["Number","optional"],
//            descripcionFotoNota:["String","optional"],
//            fotoNota:["archivo","optional"],
//            nroFactura:["Number","optional"],
//            nitFactura:["Number","optional"],
//            fechaFactura:[String,"optional","format MM/DD/YYYY preferably not inserted by the user"],
//            autorizacionFactura:["String","optional"],
//            codigoControlFactura:["String","optional"],
//            importeFactura:["Number","optional"],
//            monedaFactura:["String","optional"],
//            descripcionFotoFactura:["String","optional"],
//            fotoFactura:["archivo","optional"]
//        }
//    }
        .post(ctrlEmpleado.authenticate,upload.fields([
        {name: "fotoNota", maxCount:1},
        {name: "fotoFactura", maxCount:1}]), ctrlCompra.addPago);
    router.route("/empresa/:idEmpresa/compra/:idCompra/pago/:idPago")
    //delete pedido
    //    {
    //        returns:{
    //            success:["204"],
    //            fail:["500","404"]
    //        },
    //        receives:{
    //        }
    //    }
    .delete(ctrlEmpleado.authenticate, ctrlCompra.deletePago);
};