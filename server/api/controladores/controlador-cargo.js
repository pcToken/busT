var mongoose = require('mongoose');
var Cargo = mongoose.model('Cargo');
var Empresa  = mongoose.model("Empresa");
var promise = require("bluebird");
var funciones = require("./funciones");
//crear un nuevo cargo para una empresa bajo un cargo o de gerente General
module.exports.crearCargo = function(req, res) {
    if(!req.body.esArea || !req.body.nombre){
        funciones.handleError({
            statusCode:400,
            message:"missing data"
        },res);
        return;
    }
    var cargo= {
        esArea: req.body.esArea,
        nombre: req.body.nombre,
        empresa:req.params.idEmpresa
    };
    Cargo.create(cargo).then(cargo=>{
        if(req.body.padre){
            Cargo.findById(req.body.padre).then(padre=>{
                if(!padre)throw({
                    statusCode:404,
                    message:"padre not found"
                });
                if(!padre.hijos) padre.hijos = [];
                padre.hijos.push(cargo._id);
                cargo.padre = padre._id;
                return promise.join(padre.save(),cargo.save());
            }).then((padre, cargo)=>{
                res.status(201).json();
            }).catch(err=>{
                funciones.handleError(err,res);
            });
        }else{
            Empresa.findById(req.params.idEmpresa).then(empresa=>{
                if(!empresa)throw({
                    statusCode:404,
                    message:"empresa not found"
                });
                empresa.gerenteGeneral = cargo._id;
                return promise.join(empresa.save(),cargo.save());
            }).then((empresa, cargo)=>{
                res.status(201).json();
            }).catch(err=>{
                funciones.handleError(err,res);
            });
        }
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//mostrar los cargos asociados a una empresa sin los hijos
module.exports.mostrarCargos = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Cargo.find({empresa:idEmpresa,activo:true}).select("-hijos").then(cargos=>{
        res.status(200).json(cargos);
    }).catch(err=>{
        funciones.handleError(err, res);
    }); 
};
//mostrar los cargos asociados a una empresa sin los hijos
module.exports.mostrarCargosCompleto = function(req, res){
    var idEmpresa = req.params.idEmpresa;
    Cargo.find({empresa:idEmpresa}).select("-hijos").then(cargos=>{
        res.status(200).json(cargos);
    }).catch(err=>{
        funciones.handleError(err, res);
    }); 
};
//mostrar cargo en especifico
module.exports.mostrarCargo = function(req, res){
    Cargo.findById(req.params.idCargo).then(cargo=>{
        if(!cargo){
          throw({
                statusCode:404,
                message:"cargo not found"
          });  
        }
        res.status(200).json(cargo);
    }).catch(err=>{
        funciones.handleError(err, res);
    }); 
};
//actualizar cargo en especifico
module.exports.actualizarCargo = function(req, res, next){
     Cargo.findById(req.params.idCargo)
         .select("-hijos")
         .then(cargo=>{
         if(!cargo){
             throw({
                    statusCode:404,
                    message:"cargo not found"
              });  
         }
         if(req.body.nombre) cargo.nombre = req.body.nombre;
         if(req.body.esArea) cargo.esArea = req.body.esArea;
         if(req.body.activo) cargo.activo = req.body.activo;
         if(req.body.padre) {
             return funciones.actualizarPadreDeCargo(req.params.idEmpresa,cargo,req.body.padre);
         }
         return cargo.save();
     }).then(()=>{
         res.status(204).json();
     }).catch(err =>{
         funciones.handleError(err, res);
     });
        
};
//eliminar cargo

module.exports.borrarCargo = function(req, res){
    Cargo.findById(req.params.idCargo).then(cargo=>{
        if(!cargo){
            throw({
                statusCode:404,
                message:"cargo not found"
            });
        }
        var tieneHijos = false;
        cargo.hijos.map(hijo=>{
            if(hijo.activo){
                tieneHijos = true;
            }
        });
        if(tieneHijos){
            throw({
                statusCode:400,
                message:"cargo has children"
            });
        }
        cargo.activo = false;
        return cargo.save();
    }).then(()=>{
        res.status(204).json();
    }).catch(err =>{
        funciones.handleError(err, res);
    });
};