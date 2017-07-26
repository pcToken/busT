var mongoose = require("mongoose");
var promise = require("bluebird");
mongoose.promise = promise;
var Empresa = mongoose.model('Empresa');
var funciones = require("./funciones");


/// testing barcode
var barcode = require("barcode");
var gtin = require("gtin.js").Gtin;
var path = require("path");

// anadir empresas
// se anhade el id, nombre y el gerente general
module.exports.crearEmpresa = function(req,res){
    if(!req.body._id || !req.body.nombre){
        funciones.handleError({
            statusCode:"400",
            message:"_id or nombre missing"
        },res);
        return;
    }
  var empresa = {
      _id : req.body._id,
      nombre: req.body.nombre
  };
    Empresa.create(empresa).then(empresa=>{
       res.status(201).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//devuelve una empresa especificada en el idEmpresa
module.exports.mostrarEmpresa= function(req,res){
    var idEmpresa = req.params.idEmpresa;
    Empresa.findById(idEmpresa).populate("gerenteGeneral").then(empresa=>{
        if(!empresa){
            throw({
                statusCode:"404",
                message:"empresa not found"
            });
        }
        empresa.gerenteGeneral = funciones.filterCargoTree(empresa.gerenteGeneral);
        res.status(200).json(empresa);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//devuelve todas las empresas menos el organigrama
module.exports.mostrarEmpresas = function(req, res) {
    Empresa.find({activo:true}).then(empresas=>{
            res.status(200).json(empresas);
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};


//actualiza los datos de una empresa en especifico
module.exports.actualizarEmpresa = function(req, res){
    Empresa.findById(req.params.idEmpresa)
        .select("-sucursal -gerenteGeneral").then(empresa=> {
        if(!empresa){
            throw({
                statusCode:"404",
                message:"empresa not found"
            });
        }
        if(req.body.nombre)empresa.nombre = req.body.nombre;
        if(req.body.activo) empresa.activo = req.body.activo;
        return empresa.save();
    }).then(empresa=>{
        res.status(204).json();
    }).catch(err=>{
        funciones.handleError(err,res);
    });
};
//borrar una empresa
module.exports.borrarEmpresa = function(req, res){
    Empresa.findById(req.params.idEmpresa).select("activo").then(empresa=>{
        if(!empresa){
            throw({
                statusCode:"404",
                message:"empresa not found"
            });
        }
        empresa.activo = false;
        return empresa.save();
    }).then(empresa=>{
        res.status(204).json();
    }).catch(err =>{
        funciones.handleError(err,res);
    });
};
//testing barcode
module.exports.getBarcode = function(req, res){
    var upcBarCode = barcode("UPC-A",{
        data:gtin.withCheckDigit("01234567891"),
        width:400,
        height:100
    });
    var outfile = path.join(__dirname, 'imgs', 'mycode.png');
    upcBarCode.saveImage(outfile, function (err) {
        if (err) throw err;

        console.log('File has been written!');
        res.status(200).json();
    });
}
