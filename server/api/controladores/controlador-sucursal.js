var mongoose = require("mongoose");
var Empresa = mongoose.model('Empresa');
var funciones = require("./funciones.js");

module.exports.crearSucursal = function(req, res){
    if(!req.body.nombreSucursal){
        funciones.handleError({
            statusCode:"400",
            message:"missing data"
        },res);
    }
    var sucursal = {
      nombreSucursal:req.body.nombreSucursal,
    };
    if(req.body.ciudad)sucursal.ciudad=req.body.ciudad;
    if(req.body.direccion)sucursal.direccion=req.body.direccion;
    if(req.body.long && req.body.lat) sucursal.georef = [req.body.long, req.body.lat];
    if(req.body.telefono)sucursal.telefono=req.body.telefono;
    if(req.body.email)sucursal.email=req.body.email;
    if(req.body.dias && req.body.horarios){
        //guardando horarios en sucursal
        var horario = [];
        var dias = funciones._splitArray(req.body.dias);
        var horarios= funciones._splitArray(req.body.horarios);
        for(i =0;i<horarios.length;i++){
            horario.push({dia:dias[i],horario:horarios[i]});
        }
        sucursal.horario = horario;
    }
    //agregar la sucursal a la empresa
    Empresa.findById(req.params.idEmpresa).then(empresa=>{
        if(!empresa){
            throw({
                statusCode:404,
                message:"empresa not found"
            });
        }
        if(!empresa.sucursal) empresa.sucursal = [];
        empresa.sucursal.push(sucursal);
        return empresa.save();
    }).then(empresa=>{
        res.status(201).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
    
};
// mostrar todas las sucursales de una empresa
module.exports.mostrarSucursales = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Empresa.findById(idEmpresa).select("sucursal").then(empresa=>{
        if(!empresa){
            throw({
                statusCode:404,
                message:"empresa not found"
            });
        }
        var sucursales = [];
        empresa.sucursal.map(function(e){
            if(e.activo){
                sucursales.push(e);
            }
        });
        res.status(200).json(sucursales);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
// mostrar todas las sucursales de una empresa incluyendo los eliminados
module.exports.mostrarSucursalesCompleto = function(req, res){
   var idEmpresa = req.params.idEmpresa;
    Empresa.findById(idEmpresa).select("sucursal").then(empresa=>{
        if(!empresa){
            throw({
                statusCode:404,
                message:"empresa not found"
            });
        }
        res.status(200).json(empresa.sucursal);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//mostrar una sucursal en especifico
module.exports.mostrarSucursal = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idSucursal = req.params.idSucursal;
    Empresa.findById(idEmpresa).select("sucursal").then(empresa=>{
        if(!empresa){
            throw({
                statusCode:404,
                message:"empresa not found"
            });
        }
        if(empresa.sucursal.id(idSucursal)){
            res.status(200).json(empresa.sucursal.id(idSucursal));
        }
        else{
            throw({
                statusCode:404,
                message:"sucursal not found"
            });
        }
    }).catch(err=>{
        funciones.handleError(err,res);
    }); 
};
//actualizar una sucursal de una empresa
module.exports.actualizarSucursal = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("sucursal").then(empresa=>{
        var sucursal = empresa.sucursal.id(req.params.idSucursal);
        if(!empresa || !sucursal){
            throw({
                statusCode:404,
                message:"not found"
            });
        }
        if(req.body.nombreSucursal) sucursal.nombreSucursal =req.body.nombreSucursal;
        if(req.body.ciudad) sucursal.ciudad =req.body.ciudad;
        if(req.body.direccion) sucursal.direccion =req.body.direccion;
        if(req.body.long) sucursal.georef[0] = req.body.long;
        if(req.body.lat) sucursal.georef[1] = req.body.lat;
        if(req.body.telefono) sucursal.telefono = req.body.telefono;
        if(req.body.horario){
            //guardando horarios en sucursal
            var dias = funciones._splitArray(req.body.dias);
            var horarios= funciones._splitArray(req.body.horarios);
            for(i =0;i<horarios.length;i++){
                horario.push({dia:dias[i],horario:horarios[i]});
            }
            sucursal.horario = horario;
        } 
        if(req.body.email) sucursal.email = req.body.email;
        if(req.body.activo) sucursal.activo = req.body.activo;
        //save the updated instance
        return empresa.save();
    }).then(empresa=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//eliminar una sucursal
module.exports.borrarSucursal = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("sucursal")
        .then(empresa=>{
        var sucursal = empresa.sucursal.id(req.params.idSucursal);
        if(!empresa || !sucursal){
            throw({
                statusCode:404,
                message:"not found"
            });
        }
        sucursal.activo = false;
        return empresa.save();
    }).then(empresa=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};