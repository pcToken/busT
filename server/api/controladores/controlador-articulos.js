var mongoose = require("mongoose");
var promise = require("bluebird");
mongoose.promise = promise;
var Articulo = mongoose.model('Articulo');
var fs = require("fs");
var funciones = require("./funciones.js");
var messages = require("../messages.js");




//borrar fotos logicamente
module.exports.borrarFotos = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).then(articulo=>{
        if(!req.body.idFotos) throw({
            statusCode:400,
            message:messages.E10102
        });
        else if(!articulo){
            throw({
                statusCode:404,
                message:"articulo not found"
            });
        }
        var idFotos = funciones._splitArray(req.body.idFotos);
        idFotos.map(idFoto=>{
            var foto = articulo.detalle.fotos.id(idFoto);
            if(foto) foto.activo = false;
        });
        return articulo.save();
    }).then(()=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//agregar fotos
module.exports.agregarFotos = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).then(articulo=>{
        if(!req.files || !req.body.nombresFotos || !req.body.descripcionesFotos) throw({
                statusCode:400,
                message:messages.E10101
            });
        var nombresFotos = funciones._splitArray(req.body.nombresFotos);
        var fotos = req.files;
        var descripcionesFotos = funciones._splitArray(req.body.descripcionesFotos);
        var length = fotos.length;
        if(nombresFotos.length != length || descripcionesFotos.length != length) throw({
            statusCode:400,
            message:"number of photos different from number of names or descriptions"
        });
        if(!articulo.detalle) articulo.detalle = {};
        if(!articulo.detalle.fotos)articulo.detalle.fotos = [];

        // llenar arreglo con las fotos sus nombres y sus descripciones
        for(var i = 0; i < fotos.length ; i++){
            //conviritiendo imagen en base64
            var fotoBase64 = fs.readFileSync(fotos[i].path).toString("base64");
            articulo.detalle.fotos.push({
                imagen: fotoBase64,
                nombre: nombresFotos[i],
                descripcion: descripcionesFotos[i]
            });
        }
        funciones.borrarFotos(req.files);
        return articulo.save();
    }).then(()=>{
        res.status(201).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//borrar articulo
module.exports.borrarArticulo = function(req, res){
    var codigoArticulo = req.params.codigoArticulo;
    Articulo.findOneAndUpdate({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo},{$set:{activo:false}}).then(articulo=>{
        if(!articulo){
            throw({
                statusCode:404,
                message:messages.E10202 // not found
            });
        }
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//actualizar un articulo
module.exports.actualizarArticulo = function(req, res){
    var codigoArticulo = req.params.codigoArticulo;
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).then(articulo=>{
        if(!articulo){
            throw({
                statusCode:404,
                message:"articulo not found"
            });
        }
        if(req.body.enlaces) articulo.detalle.enlaces = funciones._splitArray(req.body.enlaces);
        if(req.body.caracteristica) articulo.caracteristica = req.body.caracteristica;
        if(req.body.codigo) articulo.codigo = req.body.codigo;
        if(req.body.embalaje) articulo.embalaje = req.body.embalaje;
        if(req.body.cantidadPorPaquete) articulo.cantidadPorPaquete = req.body.cantidadPorPaquete;
        if(req.body.precio) articulo.precio = req.body.precio;
        if(req.body.moneda) articulo.moneda = req.body.moneda;
        if(req.body.stock) articulo.stock = req.body.stock;
        if(req.body.clasificacion) articulo.clasificacion = JSON.parse(req.body.clasificacion);
        if(req.body.nombre) articulo.nombre = req.body.nombre;
        if(req.body.activo) articulo.activo = req.body.activo;
        if(req.body.padre){
            return funciones.actualizarPadreDeArticulo(req.params.idEmpresa,articulo,req.body.padre);
        }
        return articulo.save();
    }).then(articulo=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// mostrar un articulo en especifico
module.exports.mostrarArticulo = function(req, res){
    Articulo.findOne({empresa:req.params.idEmpresa,codigo:req.params.codigoArticulo}).then(articulo=>{
        if(!articulo){
            throw({
                statusCode:404,
                message:"articulo not found"
            });
        }
        res.status(200).json(funciones.filtrarFotos(articulo));
    }).catch(err=>{
        funciones.handleError(err,res);
    });
    
};
//mostrar articulos
module.exports.mostrarArticulosCompleto = function(req, res) {
    Articulo.find({empresa:req.params.idEmpresa}).then(articulos=>{
        res.status(200).json(articulos);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//mostrar todos los articulos activos
module.exports.mostrarArticulos = function(req, res) {
    Articulo.find({empresa:req.params.idEmpresa, activo: true}).then(articulos=>{
        res.status(200).json(funciones.filtrarFotos(articulos));
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// crear un articulo
module.exports.crearArticulo = function(req, res) {
    if(!req.body.codigo || !req.body.nombre || !req.body.precio || !req.body.moneda || !req.body.stock){
        funciones.handleError({
            statusCode:400,
            message:"missing data"
        },res);
        return;
    }
    var articulo = {
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        empresa: req.params.idEmpresa,
        precio : req.body.precio,
        moneda : req.body.moneda,
        stock : req.body.stock,
    };
    // si hay fotos guardarlas en el articulo
    if(req.files){
        console.log(req.files);
        var nombresFotos = funciones._splitArray(req.body.nombresFotos);
        var fotos = req.files;
        var descripcionesFotos = funciones._splitArray(req.body.descripcionesFotos);
        
        articulo.detalle = {};
        articulo.detalle.fotos = [];
        
        if(nombresFotos.length != fotos.length){
            funciones.handleError({
                statusCode:400,
                message:"number of photos different from number of names or descriptions"
            },res);
            return;
        }
        // llenar arreglo con las fotos sus nombres y sus descripciones
        for(var i = 0; i < fotos.length ; i++){
            var fotoBase64 = fs.readFileSync(fotos[i].path).toString("base64");
            articulo.detalle.fotos.push({
                imagen: fotoBase64,
                nombre: nombresFotos[i],
                descripcion: descripcionesFotos[i]
            });
        }
        funciones.borrarFotos(req.files);
    }
    if(req.body.enlaces) articulo.detalle.enlaces = funciones._splitArray(req.body.enlaces);
    if(req.body.caracteristica) articulo.caracteristica = req.body.caracteristica;
    if(req.body.embalaje) articulo.embalaje = req.body.embalaje;
    if(req.body.cantidadPorPaquete) articulo.cantidadPorPaquete = req.body.cantidadPorPaquete;
    if(req.body.clasificacion) articulo.clasificacion = JSON.parse(req.body.clasificacion);
    Articulo.create(articulo).then(articulo=>{
        if(req.body.padre){
            return funciones.actualizarPadreDeArticulo(req.params.idEmpresa,articulo,req.body.padre);
        }
        return;
    }).then(()=>{
        res.status(201).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};