var mongoose = require("mongoose");
var promise = require("bluebird");
mongoose.promise = promise;
var funciones = require("./funciones");
var messages = require("../messages.js");
var Almacen = mongoose.model("Almacen");
var Ubicacion = mongoose.model("Ubicacion");
var fs = require("fs");

// add almacen
module.exports.addAlmacen = function(req, res){
    if(!req.body.nombre){
        funciones.handleError({
            statusCode:400,
            message:(messages.E10101)//missing obligatory data
        },res);
        return;
    }
    var almacen = {
        empresa: req.params.idEmpresa,
        nombre : req.body.nombre
    };
    almacen.direccion = {};
    
    almacen.direccion.nombre = req.body.nombreDireccion || "";
    almacen.direccion.pais = req.body.paisDireccion || "";
    almacen.direccion.ciudad = req.body.ciudadDireccion || "";
    almacen.direccion.calle = req.body.calleDireccion || "";
    if(req.body.longitudeDireccion && req.body.latitudeDireccion){
        almacen.direccion.georef = [req.body.longitudeDireccion, req.body.latitudeDireccion];
    }
    Almacen.create(almacen).then(almacen=>{
        res.status(200).json(almacen);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// get almacenes
module.exports.getAlmacenes = function(req, res){
    Almacen.find({empresa: req.params.idEmpresa, activo : true}).then(almacenes=>{
        almacenes.map(almacen =>{
            if(almacen.ubicaciones){
                almacen.ubicaciones = funciones.filterByActivoInArray(almacen.ubicaciones);
            }
        });
        res.status(200).json(almacenes);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// get almacenes completo
module.exports.getAlmacenesCompleto = function(req, res){
    Almacen.find({empresa: req.params.idEmpresa}).then(almacenes=>{
        res.status(200).json(almacenes);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// get almacen
module.exports.getAlmacen = function(req, res){
    Almacen.findById(req.params.idAlmacen).then(almacen=>{
         if(!almacen){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            });
        }
        almacen.ubicaciones = funciones.filterByActivoInArray(almacen.ubicaciones);
        res.status(200).json(almacen);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// delete almacen
module.exports.deleteAlmacen = function(req,res){
    Almacen.findByIdAndUpdate({"_id":req.params.idAlmacen},{$set:{"activo":false}}).then(almacen=>{
        if(!almacen){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            });
        }
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// update almacen
module.exports.updateAlmacen = function(req, res){
    Almacen.findById(req.params.idAlmacen).then(almacen=>{
        almacen.nombre = req.body.nombre || almacen.nombre;
        almacen.direccion.nombre = req.body.nombreDireccion || almacen.direccion.nombre;
        almacen.direccion.pais = req.body.paisDireccion || almacen.direccion.pais;
        almacen.direccion.ciudad = req.body.ciudadDireccion || almacen.direccion.ciudad;
        almacen.direccion.calle = req.body.calleDireccion || almacen.direccion.calle;
        almacen.activo = req.body.activo || almacen.activo;
        if(req.body.longitudeDireccion && req.body.latitudeDireccion){
            almacen.direccion.georef = [req.body.longitudeDireccion, req.body.latitudeDireccion];
        }
        return almacen.save();
    }).then(almacen =>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// add ubicacion
module.exports.addUbicacion = function(req, res){
    Almacen.findById(req.params.idAlmacen).then(almacen =>{
        if(!almacen){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            });
        }
        // crear objeto ubicacion
        if(!req.body.nombre){
            throw({
                statusCode:400,
                message:(messages.E10101)//missing obligatory data
            });
        }
        this.ubicacion = {
            nombre : req.body.nombre,
            cantidadActual: 0,
            cantidadActualHijos: 0
        };
        this.almacen = almacen;
        ubicacion.descripcion = req.body.descripcion || "";
        ubicacion.cantidadMaxima = req.body.cantidadMaxima || "";
        return Ubicacion.create(ubicacion);
    }).then(ubicacion=>{
        this.ubicacion = ubicacion;
        if(req.body.padre){
            Ubicacion.findById(req.body.padre).then(padre=>{
                if(!padre){
                    throw({
                        statusCode:"404",
                        message:messages.E10202 // not found
                    }); 
                }
                if(!padre.hijos) padre.hijos = [];
                padre.hijos.push(ubicacion._id);
                ubicacion.padre = padre._id;
                return promise.all([padre.save(),ubicacion.save()]);
            });
        }
        else{
            if(!almacen.ubicaciones) almacen.ubicaciones = [];
            almacen.ubicaciones.push(ubicacion._id);
            return almacen.save();
        }
    }).then(contenedor =>{
        res.status(200).json(ubicacion);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
// update ubicacion
module.exports.updateUbicacion = function(req, res){
    promise.all([Almacen.findById(req.params.idAlmacen),Ubicacion.findById(req.params.idUbicacion)]).spread((almacen, ubicacion)=>{
        if(!almacen || !ubicacion){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            }); 
        }
        ubicacion.nombre = req.body.nombre || ubicacion.nombre;
        ubicacion.descripcion = req.body.descripcion || ubicacion.descripcion;
        ubicacion.cantidadMaxima = req.body.cantidadMaxima || ubicacion.cantidadMaxima;
        if(req.body.padre && (ubicacion.padre || ubicacion.padre != "")){
            return funciones.changeParentUbicacion(ubicacion, req.body.padre);
        }
        return ubicacion;
    }).then(ubicacion=>{
        if(req.body.cantidadActual && req.body.cantidadActual >0){
            return funciones.updateQuantityInParents(ubicacion, ubicacion.cantidadActual, req.body.cantidadActual, false);
        }
        return ubicacion;
    }).then(ubicacion=>{
        return ubicacion.save();
    }).then(ubicacion=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });;
}
// delete ubicacion
module.exports.deleteUbicacion = function(req, res){
    Ubicacion.findByIdAndUpdate({"_id":req.params.idUbicacion},{$set:{"activo":false}}).then(ubicacion=>{
        if(!ubicacion){
            throw({
                statusCode:"404",
                message:messages.E10202 // not found
            });
        }
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
