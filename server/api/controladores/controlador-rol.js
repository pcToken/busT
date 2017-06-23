var mongoose = require("mongoose");
var promise = require("bluebird");
var funciones = require("./funciones")
promise.promise = promise;
var Rol = mongoose.model("Rol");
//crear rol
module.exports.crearRol = function(req, res){
    if(!req.body.nombre){
        funciones.handleError({
            statusCode:400,
            message:"missing name"
        },res);
    }
    else{
        var rol = {
            nombre : req.body.nombre,
            empresa: req.params.idEmpresa
        };
        Rol.create(rol).then(rol =>{
            if(rol){
                res.status(201).json(rol);
            }
            else{
                throw({
                    statusCode:400,
                    message:"something went wrong creating the rol"
                });
            }
        }).catch(err=>{
            funciones.handleError(err,res);
        });
    }
};
//mostrar todos los roles activos de la empresa
module.exports.mostrarRoles = function(req, res) {
    Rol.find({activo:true, empresa : req.params.idEmpresa}).then(roles=>{
        res.status(200).json(roles);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//mostrar todos los roles de la empresa
module.exports.mostrarRolesCompleto = function(req, res) {
    Rol.find({empresa : req.params.idEmpresa}).then(roles=>{
        res.status(200).json(roles);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//borrar rol
module.exports.borrarRol = function(req, res) {
    var idRol = req.params.idRol;
    var idEmpresa = req.params.idEmpresa;
    Rol.findOne({_id:idRol,empresa:idEmpresa}).then(rol=>{
        if(!rol){
            throw({
                statusCode:404,
                message:"rol not found"
            });
        }else{
            rol.activo = false;
            return rol.save();
        }
    }).then(rol=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
//mostrar rol
module.exports.mostrarRol = function(req, res) {
    var idRol = req.params.idRol;
    var idEmpresa = req.params.idEmpresa;
    Rol.findOne({_id:idRol,empresa:idEmpresa}).then(rol=>{
        if(!rol){
            throw({
                statusCode:404,
                message:"rol not found"
            });
        }
        else{
            res.status(200).json(rol);
        }
    }).catch(err=>{
        funciones.handleError(err,res);
    });
}
// actualizar rol
module.exports.actualizarRol = function(req, res) {
    var idRol = req.params.idRol;
    var idEmpresa = req.params.idEmpresa;
    Rol.findOne({_id:idRol,empresa:idEmpresa}).then(rol=>{
        if(!rol){
            throw({
                statusCode:404,
                message:"rol not found"
            });
        }
        else{
            rol.nombre = (req.body.nombre)? req.body.nombre:rol.nombre;
            rol.activo = (req.body.activo)? req.body.activo : rol.activo;
            return rol.save();
        }
    }).then(rol=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });;
};