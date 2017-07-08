var mongoose = require("mongoose");
var promise = require("bluebird");
mongoose.promise = promise;
var Proveedor = mongoose.model('Proveedor');
var funciones = require("./funciones");
var messages = require("../messages.js");

//get all active proveedor
module.exports.getProveedores = function(req,res){
    Proveedor.find({activo:true,empresa:req.params.idEmpresa}).then(function(proveedores){
        //only active contacts
        proveedores.map(function(proveedor){
            contactosActivos = [];
            proveedor.contactos.map(function(e){
                if(e.activo)contactosActivos.push(e);
            });
            proveedor.contactos = contactosActivos;
        });
        res.status(200).json(proveedores);
    }).catch(err =>{
        funciones.handleError(err,res);
    });
};
// create proveedor
module.exports.createProveedor = function(req, res){
    if(!req.body.nombre){
        funciones.handleError({
            statusCode:"400",
            message: messages.E10101 // missing obligatory data
        },res);
        return;
    }
    var proveedor ={
        nombre: req.body.nombre,
        empresa: req.params.idEmpresa
    };
    if(req.body.abreviatura) proveedor.abreviatura = req.body.abreviatura;
    if(req.body.nombreFactura) proveedor.nombreFactura = req.body.nombreFactura;
    if(req.body.nit) proveedor.nit = req.body.nit;
    if(req.body.fechaRegistro) proveedor.fechaRegistro = Date.parse(req.body.fechaRegistro);
    // contactos
    if(req.body.nombresContacto){
        var diferentLengths = false;
        var nombresContacto = funciones._splitArray(req.body.nombresContacto);
        
        if(req.body.cargosContacto) {
            var cargosContacto = funciones._splitArray(req.body.cargosContacto);
            if(cargosContacto.length != nombresContacto.length) diferentLengths = true;
        }
        if(req.body.correosContacto && !diferentLengths) {
            var correosContacto = funciones._splitArray(req.body.correosContacto);
            if(correosContacto.length != nombresContacto.length) diferentLengths = true;
        }
        if(req.body.celularesContacto && !diferentLengths) {
            var celularesContacto = funciones._splitArray(req.body.celularesContacto);
            if(celularesContacto.length != nombresContacto.length) diferentLengths = true;
        }
        if(req.body.telefonosContacto && !diferentLengths) {
            var telefonosContacto = funciones._splitArray(req.body.telefonosContacto);
            if(telefonosContacto.length != nombresContacto.length) diferentLengths = true;
        }
        if(diferentLengths){
            funciones.handleError({
                statusCode:"400",
                message: messages.E10201 // ; separated arrays of different length
            },res);
            return;
        }
        if(!proveedor.contactos) proveedor.contactos = [];
        nombresContacto.map((nbre,i) =>{
            var contacto = {
                nombre : nbre
            };
            if(cargosContacto) contacto.cargo = cargosContacto[i];
            if(correosContacto) contacto.correo = correosContacto[i];
            if(celularesContacto) contacto.celular = celularesContacto[i];
            if(telefonosContacto) contacto.telefono = telefonosContacto[i];
            proveedor.contactos.push(contacto);
        });
    }
    if(req.body.nombresDirecciones){
        var nombresDirecciones = funciones._splitArray(req.body.nombresDirecciones);
        var diferentLengths = false;
        if(req.body.paisesDirecciones) {
            var paisesDirecciones = funciones._splitArray(req.body.paisesDirecciones);
            if(paisesDirecciones.length != nombresDirecciones.length) diferentLengths = true;
        }
        if(req.body.callesDirecciones && !diferentLengths) {
            var callesDirecciones = funciones._splitArray(req.body.callesDirecciones);
            if(callesDirecciones.length != nombresDirecciones.length) diferentLengths = true;
        }
        if(req.body.ciudadesDirecciones && !diferentLengths) {
            var ciudadesDirecciones = funciones._splitArray(req.body.ciudadesDirecciones);
            if(ciudadesDirecciones.length != nombresDirecciones.length) diferentLengths = true;
        }
        if(req.body.referenciasDirecciones && !diferentLengths) {
            var referenciasDirecciones = funciones._splitArray(req.body.referenciasDirecciones);
            if(referenciasDirecciones.length != nombresDirecciones.length) diferentLengths = true;
        }
        if(req.body.longsDirecciones && req.body.latsDirecciones && !diferentLengths) {
            var longsDirecciones = funciones._splitArray(req.body.longsDirecciones);
            if(longsDirecciones.length != nombresDirecciones.length) diferentLengths = true;
        }
        if(req.body.longsDirecciones && req.body.latsDirecciones && !diferentLengths) {
            var latsDirecciones = funciones._splitArray(req.body.latsDirecciones);
            if(latsDirecciones.length != nombresDirecciones.length) diferentLengths = true;
        }
        if(diferentLengths){
            funciones.handleError({
                statusCode:"400",
                message: messages.E10201 // ; separated arrays of different length
            },res);
            return;
        }
        if(!proveedor.direcciones) proveedor.direcciones = [];
        nombresDirecciones.map((nomb, i)=>{
            var direccion ={
                nombre: nomb
            };
            if(paisesDirecciones) direccion.pais = paisesDirecciones[i];
            if(ciudadesDirecciones) direccion.ciudad = ciudadesDirecciones[i];
            if(callesDirecciones) direccion.calle = callesDirecciones[i];
            if(referenciasDirecciones) direccion.referencia = referenciasDirecciones[i];
            if(longsDirecciones) direccion.georef = [longsDirecciones[i],latsDirecciones[i]];
            proveedor.direcciones.push(direccion);
        });
    }
    if(req.body.idPropioArticulos){
        var idPropioArticulos = funciones._splitArray(req.body.idPropioArticulos);
        var diferentLengths = false;
        if(req.body.idProveedorArticulos){
            var idProveedorArticulos = funciones._splitArray(req.body.idProveedorArticulos);
            if(idProveedorArticulos.length != idPropioArticulos.length) diferentLengths = true;
        }
        if(diferentLengths){
            funciones.handleError({
                statusCode:"400",
                message: messages.E10201 // ; separated arrays of different length
            },res);
            return;
        }
        if(!proveedor.productos) proveedor.productos = [];
        idPropioArticulos.map((idPropioArticulo,i) =>{
            var articulo = {
                idArticulo : idPropioArticulo
            };
            if(idProveedorArticulos) articulo.idArticuloProveedor = idProveedorArticulos[i];
            proveedor.productos.push(articulo);
        })
    }
    Proveedor.create(proveedor).then(proveedor=>{
        res.status(201).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//get all proveedor
module.exports.getProveedoresCompleto = function(req,res){
    Proveedor.find({empresa:req.params.idEmpresa}).then(function(proveedores){
        res.status(200).json(proveedores);
    }).catch(err =>{
        funciones.handleError(err,res);
    });
};
//get proveedor
module.exports.getProveedor = function(req, res){
    Proveedor.findById(req.params.idProveedor).then(proveedor =>{
        if(!proveedor){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        var activeContacts = [];
        proveedor.contactos.map(c=>{
            if(c.activo){
                activeContacts.push(c);
            }
        });
        proveedor.contactos = activeContacts;
        res.status(200).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// update proveedor
module.exports.updateProveedor = function(req, res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        if(!proveedor){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(req.body.nombre && req.body.nombre!= "") proveedor.nombre = req.body.nombre;
        if(req.body.abreviatura) proveedor.abreviatura = req.body.abreviatura;
        if(req.body.nombreFactura) proveedor.nombreFactura = req.body.nombreFactura;
        if(req.body.nit) proveedor.nit = req.body.nit;
        return proveedor.save();
    }).then(proveedor =>{
        res.status(204).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// delete proveedor
module.exports.deleteProveedor = function(req, res){
    Proveedor.findOneAndUpdate({_id:req.params.idProveedor},{$set:{activo:false}}).then(proveedor=>{
        if(!proveedor){
            throw({
                statusCode:404,
                message:messages.E10202 // not found
            });
        }
        res.status(204).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};

//add proveedor
module.exports.addContacto = function(req, res){
    if(!req.body.nombre){
        funciones.handleError({
            statusCode:"400",
            message: messages.E10101 // missing obligatory data
        },res);
        return;
    }
    var contacto = {
        nombre:req.body.nombre
    };
    if(req.body.cargo) contacto.cargo = req.body.cargo;
    if(req.body.correo) contacto.correo = req.body.correo;
    if(req.body.celulares) contacto.celular = funciones._splitArray(req.body.celulares);
    if(req.body.telefonos) contacto.telefono= funciones._splitArray(req.body.telefonos);
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        if(!proveedor){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(!proveedor.contactos) proveedor.contactos = [];
        proveedor.contactos.push(contacto);
        return proveedor.save();
    }).then(proveedor=>{
        res.status(201).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//add proveedor
module.exports.updateContacto = function(req, res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        var contacto = proveedor.contactos.id(req.params.idContacto);
        if(!proveedor || !contacto){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(req.body.nombre) contacto.nombre = req.body.nombre;
        if(req.body.cargo) contacto.cargo = req.body.cargo;
        if(req.body.correo) contacto.correo = req.body.correo;
        if(req.body.celulares) contacto.celular = funciones._splitArray(req.body.celulares);
        if(req.body.telefonos) contacto.telefono = funciones._splitArray(req.body.telefonos);
        return proveedor.save();
    }).then(proveedor=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//add proveedor
module.exports.deleteContacto = function(req, res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        var contacto = proveedor.contactos.id(req.params.idContacto);
        if(!proveedor || !contacto){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        contacto.activo = false;
        return proveedor.save();
    }).then(proveedor=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//add direccion
module.exports.addDireccion = function(req,res){
    if(!req.body.nombre){
        funciones.handleError({
            statusCode:"400",
            message: messages.E10101 // missing obligatory data
        },res);
        return;
    }
    var direccion = {
        nombre:req.body.nombre
    };
    if(req.body.pais) direccion.pais = req.body.pais;
    if(req.body.ciudad) direccion.ciudad = req.body.ciudad;
    if(req.body.calle) direccion.calle = req.body.calle;
    if(req.body.referencia) direccion.referencia = req.body.referencia;
    if(req.body.longitude && req.body.latitude) direccion.georef = [req.body.longitude,req.body.latitude];
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        if(!proveedor){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(!proveedor.direcciones) proveedor.direcciones = [];
        proveedor.direcciones.push(direccion);
        return proveedor.save();
    }).then(proveedor=>{
        res.status(201).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//update direccion
module.exports.updateDireccion = function(req,res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        var direccion = proveedor.direcciones.id(req.params.idDireccion);
        if(!proveedor || !direccion){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(req.body.nombre) direccion.nombre = req.body.nombre;
        if(req.body.pais) direccion.pais = req.body.pais;
        if(req.body.ciudad) direccion.ciudad = req.body.ciudad;
        if(req.body.calle) direccion.calle = req.body.calle;
        if(req.body.referencia) direccion.referencia = req.body.referencia;
        if(req.body.longitude && req.body.latitude) direccion.georef = [req.body.longitude,req.body.latitude];
        return proveedor.save();
    }).then(proveedor=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//delete direccion
module.exports.deleteDireccion = function(req,res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        var direccion = proveedor.direcciones.id(req.params.idDireccion);
        if(!proveedor || !direccion){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        proveedor.direcciones.remove(req.params.idDireccion);
        return proveedor.save();
    }).then(proveedor=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//add producto
module.exports.addProducto = function(req,res){
    if(!req.body.idArticulo){
        funciones.handleError({
            statusCode:"400",
            message: messages.E10101 // missing obligatory data
        },res);
        return;
    }
    var producto = {
        idArticulo:req.body.idArticulo
    };
    if(req.body.idArticuloProveedor) producto.idArticuloProveedor = req.body.idArticuloProveedor;
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        if(!proveedor){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(!proveedor.productos) proveedor.productos = [];
        proveedor.productos.push(producto);
        return proveedor.save();
    }).then(proveedor=>{
        res.status(201).json(proveedor);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//update producto
module.exports.updateProducto = function(req,res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        var producto = proveedor.productos.id(req.params.idProducto);
        if(!proveedor || !producto){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        if(req.body.idArticulo) producto.idArticulo = req.body.idArticulo;
        if(req.body.idArticuloProveedor) producto.idArticuloProveedor = req.body.idArticuloProveedor;
        return proveedor.save();
    }).then(proveedor=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//delete producto
module.exports.deleteProducto = function(req,res){
    Proveedor.findById(req.params.idProveedor).then(proveedor=>{
        var producto = proveedor.productos.id(req.params.idProducto);
        if(!proveedor || !producto){
            throw({
                statusCode:404,
                message: messages.E10202 // Not found
            });
        }
        proveedor.productos.remove(req.params.idProducto);
        return proveedor.save();
    }).then(proveedor=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}

