var mongoose = require("mongoose");
var promise = require("bluebird");
mongoose.promise = promise;
var funciones = require("./funciones");
var messages = require("../messages.js");
var Compra = mongoose.model("Compra");
var Pedido = mongoose.model("CompraPedido");
var Pago = mongoose.model("CompraPago");
var fs = require("fs");

// create pedidos
// creates array of pedido with request
// returns promise
function createPedidos(req) {
    var existents =[];
    existents["idArticulo"] = req.body.idArticulosPedido;
    var differentLength = false;
    if(req.body.idProveedorArticulosPedido) {
        existents["idArticuloProveedor"] = req.body.idProveedorArticulosPedido;
        if(existents["idArticuloProveedor"].length != existents["idArticulo"].length) differentLength = true;
    }
    //cantidades pedido
    if(!differentLength){
        existents["cantidad"] = req.body.cantidadesPedido;
        if(existents["cantidad"].length != existents["idArticulo"].length) differentLength = true;
    }
    //precios unitarios pedido
    if(!differentLength){
        existents["precioUnitario"] = req.body.preciosUnitariosPedido;
        if(existents["precioUnitario"].length != existents["idArticulo"].length) differentLength = true;
    }
    //importes sin descuentos pedido
    if(!differentLength){
        existents["importeSinDescuento"] = req.body.importesSinDescuentoPedido;
        if(existents["importeSinDescuento"].length != existents["idArticulo"].length) differentLength = true;
    }
    //descuentos pedido
    // descuentos for many pedidos come as a matrix
    if(!differentLength && req.body.descuentosPedido && req.body.conceptosDescuentosPedido){
        if(req.body.descuentosPedido.length != req.body.conceptosDescuentosPedido.length){
            differentLength = true;
        }
        existents["descuentos"]=[];
        for(var i = 0;i < req.body.descuentosPedido.length && !differentLength ; i++){
            var montosD = req.body.descuentosPedido[i], conceptosD = req.body.conceptosDescuentosPedido[i];
            if(montosD.length != conceptosD.length){
                differentLength = true;
            }
            var descuentos = [];
            try{
                montosD.map((monto, j)=>{
                    descuentos.push({
                        importe:monto,
                        concepto:conceptosD[j]
                    });
                }); 
            }  catch(err){
                funciones(err, res);
                return;
            };
            existents["descuentos"][i] = descuentos;
        }
        if(existents["descuentos"].length != existents["idArticulo"].length) differentLength = true;
    }
    //importes pedido
    if(!differentLength){
        existents["importe"] = req.body.importesPedido;
        if(existents["importe"].length != existents["idArticulo"].length) differentLength = true;
    }
    //monedas pedido
    if(!differentLength){
        existents["moneda"] = req.body.monedasPedido;
        if(existents["moneda"].length != existents["idArticulo"].length) differentLength = true;
    }
    return new Promise(function (resolve, reject) {
        if(differentLength){
            reject({
                statusCode:400,
                message: messages.E10201 // array of different lengths
            });
        }
        else{
            var pedidos = [];
            for(var i = 0; i < existents["idArticulo"].length; i++){
                var pedido = {};
                Object.keys(existents).forEach(field=>{
                    pedido[field] = existents[field][i];
                });
                pedidos.push(pedido);
            }
            resolve(pedidos);
        }
    });
}

//add compra
module.exports.addCompra = function(req, res){
    var obligatoryFields = ["fecha","importeSinDescuento","importe","moneda","saldoPago","idUsuario","idArticulosPedido","cantidadesPedido","preciosUnitariosPedido","importesSinDescuentoPedido","importesPedido","monedasPedido"];
    var bad = false;
    obligatoryFields.map(field =>{
        if(!req.body || !req.body[field]){
            funciones.handleError({
                statusCode:400,
                message:(messages.E10101)//missing obligatory data
            },res);
            bad = true;
        }
    });
    if(bad) return;
    var compra = {
        empresa: req.params.idEmpresa,
        importeSinDescuento: req.body.importeSinDescuento,
        fecha : Date.parse(req.body.fecha),
        importe: req.body.importe,
        moneda: req.body.moneda,
        saldoPago: req.body.saldoPago
    };
    if(req.body.idProveedor){
        compra.idProveedor = req.body.idProveedor;
    }
    if(req.body.montosDescuentos && req.body.conceptosDescuentos){
        var montosD = req.body.montosDescuentos, conceptosD = req.body.conceptosDescuentos;
        if(montosD.length != conceptosD.length){
            funciones.handleError({
                statusCode:400,
                message: messages.E10201 // array of different lengths
            },res);
            return;
        }
        var descuentos = [];
        montosD.map((monto, i)=>{
            descuentos.push({
                importe:monto,
                concepto:conceptosD[i]
            });
        });
        compra.descuentos = descuentos;
    }
    var promises = [];
    createPedidos(req).then(pedidos =>{
        pedidos.map(pedido=>{
            promises.push(Pedido.create(pedido));
        });
        return promise.all(promises);
    }).then(pedidos =>{
        compra.pedidos = [];
        pedidos.map(pedido=>{
            compra.pedidos.push(pedido._id);
        });
        compra.detalle = {
            usuarioCompra : req.body.idUsuario
        };
        if(req.body.idContacto) compra.detalle.proveedor = req.body.idContacto;
        // !!! add compra checker
        return Compra.create(compra);
    }).then(compra=>{
        res.status(200).json(compra);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}

// get compras
module.exports.getCompras =function(req, res){
    Compra.find({empresa:req.params.idEmpresa,activo:true}).then(compras=>{
        compras.map(compra=>{
            compra.pedidos = funciones.filterByActivoInArray(compra.pedidos);
            compra.pagos = funciones.filterByActivoInArray(compra.pagos);
        });
        res.status(200).json(compras);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}

// get compras completo
module.exports.getComprasCompleto =function(req, res){
    Compra.find({empresa:req.params.idEmpresa}).then(compras=>{
        res.status(200).json(compras);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
// get compra
module.exports.getCompra =function(req, res){
    Compra.findById(req.params.idCompra).then(compra=>{
        if(!compra){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            });
        }
        compra.pedidos = funciones.filterByActivoInArray(compra.pedidos);
        compra.pagos = funciones.filterByActivoInArray(compra.pagos);
        res.status(200).json(compra);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}

// update compra
module.exports.updateCompra = function(req, res){
    Compra.findById(req.params.idCompra).then(compra=>{
        var fields=["activo","fecha","importeSinDescuento","idProveedor","importe","moneda","saldoPago","estadoPago"];
        fields.map(field=>{
            compra[field] = req.body[field] || compra[field];
        });
        if(req.body.idUsuario){
            compra.detalle.usuarioCompra = req.body.idUsuario;
        }
        if(req.body.idContacto){
            compra.detalle.proveedor = req.body.idContacto;
        }
        if(req.body.montosDescuentos && req.body.conceptosDescuentos){
            if(req.body.montosDescuentos.length !=  req.body.conceptosDescuentos.length){
                throw({
                    statusCode:400,
                    message: messages.E10201 // array of different lengths
                });
            }
            descuentos = [];
            req.body.montosDescuentos.map((monto,i)=>{
                var descuento = {
                    monto: monto,
                    concepto: req.body.conceptosDescuentos[i]
                };
                descuentos.push(descuento);
            });
            compra.descuentos = descuentos;
        }
        return compra.save();
    }).then(compra=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
// delete compra
module.exports.deleteCompra = function(req,res){
    Compra.findByIdAndUpdate({"_id":req.params.idCompra},{$set:{"activo":false}}).then(compra=>{
        if(!compra){
            throw({
                statusCode:400,
                message: messages.E10202 // not found
            });
        }
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//add pedidos
module.exports.addPedidos = function(req,res){
    Compra.findById(req.params.idCompra).then(compra=>{
        if(!compra){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            });
        }
        this.compra = compra;
        this.promises = [];
        return createPedidos(req);
    }).then(pedidos=>{
        pedidos.map(pedido=>{
            //!!! check pedido
            promises.push(Pedido.create(pedido));
        });
        return promise.all(promises);
    }).then(pedidos=>{
        if(!compra.pedidos) compra.pedidos = [];
        pedidos.map(pedido=>{
            compra.pedidos.push(pedido._id);
        });
        return compra.save();
    }).then(compra=>{
        res.status(201).json(compra);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
    
}
//get pedido
module.exports.getPedido = function(req,res){
    promise.all([Compra.findById(req.params.idCompra),Pedido.findById(req.params.idPedido)])
        .spread((compra,pedido)=>{
        if(!compra || !pedido){
            throw({
                statusCode:404,
                message: messages.E10202 // not found
            });
        }
        res.status(200).json(pedido);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//update pedido
module.exports.updatePedido = function(req,res){
    promise.all([Compra.findById(req.params.idCompra),Pedido.findById(req.params.idPedido)])
        .spread((compra,pedido)=>{
        if(!compra || !pedido){
            throw({
                statusCode:400,
                message: messages.E10202 // not found
            });
        }
        Object.keys(pedido._doc).map((field,i)=>{
            if(req.body[field] && ["descuentos","conceptos"].indexOf(field) <0){
                pedido[field] = req.body[field];
            }
        });
        if(req.body.descuentos && req.body.conceptosDescuentos){
            if(req.body.descuentos.length !=  req.body.conceptosDescuentos.length){
                throw({
                    statusCode:400,
                    message: messages.E10201 // array of different lengths
                });
            }
            descuentos = [];
            req.body.descuentos.map((monto,i)=>{
                var descuento = {
                    monto: monto,
                    concepto: req.body.conceptosDescuentos[i]
                };
                descuentos.push(descuento);
            });
            pedido.descuentos = descuentos;
        }
        //!!! chek pedido
        return pedido.save();
    }).then(pedido=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//delete pedido
module.exports.deletePedido = function(req,res){
    Pedido.findByIdAndUpdate({"_id":req.params.idPedido},{$set:{"activo":false}}).then(pedido=>{
        if(!pedido){
            throw({
                statusCode:400,
                message: messages.E10202 // not found
            });
        }
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//add pago
module.exports.addPago = function(req,res){
    var obligatoryFields = ["fecha","importe","moneda","saldo"];
    var bad = false;
    obligatoryFields.map(field =>{
        if(!req.body || !req.body[field]){
            funciones.handleError({
                statusCode:400,
                message:(messages.E10101)//missing obligatory data
            },res);
            bad = true;
        }
    });
    if (bad) return;
    var pago ={
        fecha: Date.parse(req.body.fecha),
        importe: req.body.importe,
        moneda:req.body.moneda,
        saldo:req.body.saldo
    };
    if(req.body.nroNota){
        pago.nota = {
            nro: req.body.nroNota
        };
    }
    if(req.body.descripcionFotoNota && req.files.fotoNota){
        var foto = req.files.fotoNota;
        pago.nota.descripcion = req.body.descripcionFotoNota;
        pago.nota.foto = fs.readFileSync(foto.path).toString("base64");
        funciones.borrarFotos(req.files.fotoNota);
    }
    
    if(req.body.nroFactura || req.body.nitFactura || req.body.fechaFactura || req.body.autorizacionFactura || req.body.codigoFactura || req.body.importeFactura || req.body.monedaFactura){
        pago.factura = {};
        pago.factura.nro = req.body.nroFactura || "";
        pago.factura.nit = req.body.nitFactura || "";
        pago.factura.fecha = Date.parse(req.body.fechaFactura) || "";
        pago.factura.autorizacion = req.body.autorizacionFactura || "";
        pago.factura.codigo = req.body.codigoFactura || "";
        pago.factura.importe= req.body.importeFactura || "";
        pago.factura.moneda= req.body.monedaFactura || "";
    }
    if(req.body.descripcionFotoFactura && req.files.fotoFactura){
        var foto = req.files.fotoFactura;
        pago.fotoFactura.descripcion = req.body.descripcionFotoFactura;
        pago.fotoFactura.foto = fs.readFileSync(foto.path).toString("base64");
        funciones.borrarFotos(req.files.fotoFactura);
    }
    // !!! check pago here
    Compra.findById(req.params.idCompra).then(compra=>{
        if(!compra){
            throw({
                statusCode:400,
                message: messages.E10202 // not found
            });
        }
        this.compra = compra;
        return Pago.create(pago);
    }).then(pago=>{
        this.pago = pago;
        if(!compra.pagos) compra.pagos = [];
        compra.pagos.push(pago._id);
        return compra.save();
    }).then(compra=>{
        res.status(201).json(pago);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
module.exports.deletePago = function(req,res){
    Pago.findByIdAndUpdate({"_id":req.params.idPago},{$set:{"activo":false}}).then(pago=>{
        if(!pago){
            throw({
                statusCode:404,
                message: messages.E10202 // not found
            });
        }
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}