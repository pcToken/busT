var mongoose = require("mongoose");
var promise = require("bluebird");
var winston = require("winston");
mongoose.promise = promise;
var Articulo = mongoose.model('Articulo');
var Cargo = mongoose.model('Cargo');
var fs = require("fs");
//splits values separated by ; and returns as array
module.exports._splitArray = function(input) {
    var output; 
    if (input && input.length > 0){
        output = input.split(";");
    }
    else{
        output = [];
    }
    return output;
}
//handles errors
module.exports.handleError = function(err, res){
    if(err.statusCode){
        winston.log("error",err.message);
        res.status(err.statusCode).json(err.message);
    }
    else{
        winston.log("error",err);
        res.status(500).json();
    }
}
//recives an article or array of articles and returns it without the inactive phtotos
module.exports.filtrarFotos= filtrarFotos;
function filtrarFotos(articulo){
    if(!articulo.detalle || !articulo.detalle.fotos) return articulo;
    if(articulo instanceof Array){
        articulo.map(function(e,i){
            articulo[i] = filtrarFotos(e);
        });
        return articulo;
    }
    else{
        var fotosActivas = [];
        articulo.detalle.fotos.map(function(e){
            if(e.activo) fotosActivas.push(e);
        });
        articulo.detalle.fotos = fotosActivas;
        return articulo;
    }
}
// receives the array of photos created by multer and deletes them from the uploads folder
module.exports.borrarFotos = function(fotos){
    if(!fotos) return;
    if(fotos instanceof Array){
        fotos.map(function(e){
            borrarFotos(e);
        })
    }
    else{
        fs.unlink(fotos.path, (err) => {
          if (err) console.log(err);
          console.log('foto borrada',e.path);
        });
    }
}
//recives the idEmpresa, the current articulo whose parent will be changed, and the new parent codigo wich can be "none" if want to delete currect parent
//returns promise
module.exports.actualizarPadreDeArticulo = function(idEmpresa, articulo, codigoPadre){
    var lookForNewParent = Articulo.findOne({empresa:idEmpresa, codigo: codigoPadre});
    var lookForCurrentParent = Articulo.findOne({empresa:idEmpresa, codigo:articulo.padre});
    
    return new Promise(function(success, fail){
        if(codigoPadre == "none"){
            lookForCurrentParent.then(currentParent=>{
                if(!currentParent) throw({
                        message:"current parent not found",
                        statusCode:404
                    });
                var index = currentParent.hijos.indexOf(articulo.codigo);
                currentParent.hijos.splice(index,1);
                articulo.padre = "";
                return promise.join(currentParent.save(),articulo.save());
            }).then((cp, a)=>{
                success("success");
            }).catch(err=>{
                fail(err);
            });
        }
        else{
            promise.all([lookForCurrentParent,lookForNewParent]).spread((currentParent,newParent)=>{
                if(!newParent){
                    throw({
                        message:"new parent not found",
                        statusCode:404
                    });
                }
                var saveAll=[];
                if(currentParent){
                    //delete from current parent
                    var index = currentParent.hijos.indexOf(articulo.codigo);
                    currentParent.hijos.splice(index,1);
                    var saveCurrentParent = currentParent.save();
                    saveAll.push(saveCurrentParent);
                }
                //change articulo's parent to be the new one
                articulo.padre = newParent.codigo;
                var saveArticulo = articulo.save();
                saveAll.push(saveArticulo);
                //add articulo to newParent's hijos
                if(!newParent.hijos) newParent.hijos = [];
                newParent.hijos.push(articulo.codigo);
                var saveNewParent = newParent.save();
                saveAll.push(saveNewParent);
                return promise.all(saveAll);
            }).spread(()=>{
                success("success");
            }).catch(err=>{
                fail(err);
            });
        }
    });
}
//filter not active cargos in a tree
module.exports.filterCargoTree = filterCargoTree;
function filterCargoTree(root){
    if(!root.activo){
        return null;
    }
    else if(!root.hijos){
        return root;
    }
    else{
        return root.hijos.map((e,i,arr) =>{
            e = filterCargoTree(e);
            if(e == null) arr.splice(i,1);
        });
    }
}

// change padre of cargo given by the idPadre specified
module.exports.actualizarPadreDeCargo = function(idEmpresa, cargo, idPadre){
    var lookForNewParent = Cargo.findOne({empresa:idEmpresa, _id: idPadre});
    var lookForCurrentParent = Cargo.findOne({empresa:idEmpresa, _id:cargo.padre});
    
    return new Promise(function(success, fail){
        if(idPadre == "none"){
            lookForCurrentParent.then(currentParent=>{
                if(!currentParent) throw({
                        message:"current parent not found",
                        statusCode:404
                    });
                var index = currentParent.hijos.indexOf(cargo._id);
                currentParent.hijos.splice(index,1);
                cargo.padre = "";
                return promise.join(currentParent.save(),cargo.save());
            }).then((cp, a)=>{
                success("success");
            }).catch(err=>{
                fail(err);
            });
        }
        else{
            promise.all([lookForCurrentParent,lookForNewParent]).spread((currentParent,newParent)=>{
                if(!newParent){
                    throw({
                        message:"new parent not found",
                        statusCode:404
                    });
                }
                var saveAll=[];
                if(currentParent){
                    //delete from current parent
                    var index = currentParent.hijos.indexOf(cargo._id);
                    currentParent.hijos.splice(index,1);
                    var saveCurrentParent = currentParent.save();
                    saveAll.push(saveCurrentParent);
                }
                //change cargo's parent to be the new one
                cargo.padre = newParent._id;
                var saveCargo = cargo.save();
                saveAll.push(saveCargo);
                //add cargo to newParent's hijos
                if(!newParent.hijos) newParent.hijos = [];
                newParent.hijos.push(cargo._id);
                var saveNewParent = newParent.save();
                saveAll.push(saveNewParent);
                return promise.all(saveAll);
            }).spread(()=>{
                success("success");
            }).catch(err=>{
                fail(err);
            });
        }
    });
}