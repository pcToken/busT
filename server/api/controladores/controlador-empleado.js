var mongoose = require("mongoose");
var promise = require('bluebird');
mongoose.promise = promise;
var Empleado = mongoose.model("Empleado");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var secret = require("../data/secret.js");
var funciones =require("./funciones.js");
var Rol = mongoose.model("Rol");


//agregar rol
module.exports.agregarRol = function(req, res){
    var idEmpleado = req.params.idEmpleado;
    if(!req.body.rol){
        funciones.handleError({
            statusCode:400,
            message:"missing data"
        },res);
    }
    else{
        Empleado.findOne({_id : idEmpleado}).select("-clave").then(function(empleado){
            if (empleado){
                //check if all the rols being added are of the respective empresa
                this.rols = funciones._splitArray(req.body.rol).map(mongoose.Types.ObjectId);
                var rolsVerifyingPromises = [];
                rols.map(function(r){
                    rolsVerifyingPromises.push(Rol.findById(r).select("empresa"));
                });
                    //add empleado and rols to this to bind it
                    this.empleado = empleado;
                return promise.each(rolsVerifyingPromises,function(rol){
                    if(!rol){
                        throw({
                            statusCode:404,
                            message:"rol not found"
                        });
                    }
                    else if(rol.empresa != req.params.idEmpresa){
                        throw({
                            statusCode:400,
                            message:"rol not from this empresa"
                        });
                    }
                }).bind(this);
            }
            else{
                throw({
                    statusCode:404,
                    message:"empleado not found"
                });
            }
        }).then(function(){
            this.empleado.rol = this.empleado.rol.concat(this.rols);
            return this.empleado.save();
        }).then(empleado=>{
            res.status(204).json();
        }).catch(err=>{
            funciones.handleError(err,res);
        });
    }
};
//borrar rol
module.exports.borrarRol = function(req, res){
    var idEmpleado = req.params.idEmpleado;
    Empleado.findOne({_id : idEmpleado}).select("-clave").then(function(empleado){
        if (empleado){
            var rolesABorrar = [];
            if(req.body.rol)rolesABorrar= funciones._splitArray(req.body.rol);
            rolesQueQuedan = [];
            empleado.rol.map(function(rol){
                if(rolesABorrar.indexOf(rol._id.toString())==-1){
                    rolesQueQuedan.push(rol._id);
                }
            });
            empleado.rol = rolesQueQuedan;
            return empleado.save();
        }
        else{
            throw({
                statusCode:404,
                message:"empleado not found"
            });
        }
    }).then(empleado =>{
        res.status(204).json();
    }).catch(err =>{
        funciones.handleError(err,res);
    });
};
//crear empleado
module.exports.crearEmpleado = function(req, res){
    if(!req.body.nombre || !req.body.login || !req.body.clave){
        funciones.handleError({
            statusCode:400,
            message:"missing data"
        },res);
    }
    else{
         var empleado = {
             _id : req.params.idEmpresa+"-"+ req.body.login,
             empresa: req.params.idEmpresa,
             nombre: req.body.nombre,
             login:req.body.login,
             clave: bcrypt.hashSync(req.body.clave)
         };
        if(req.body.cargo) empleado.cargo = mongoose.Types.ObjectId(req.body.cargo);
        if(req.body.sucursal) empleado.sucursal = mongoose.Types.ObjectId(req.body.sucursal);
        if(req.body.celular) empleado.celular = req.body.celular;
        if(req.body.email) empleado.email = req.body.email;
        if(req.body.direccion) empleado.direccion = req.body.direccion;
        if(req.body.sexo) empleado.sexo = req.body.sexo;
        if(req.body.fechaNacimiento) empleado.fechaNacimiento = Date.parse(req.body.fechaNacimiento);
        //enviar Horarios en horarioDias lista separada por ; y horarios lista de los horarios en mismo orden de Horario dias
        if(req.body.dias) {
            var dias = funciones._splitArray(req.body.dias);
            var horarios = funciones._splitArray(req.body.horarios);
            var horario = [];
            for(i =0;i<horarios.length;i++){
                horario.push({dia:dias[i],horario:horarios[i]});
            }
            empleado.horario = horario;
        }

        Empleado.create(empleado).then(function(empleadoCreado){
            res.status(201).json();
        }).catch(err =>{
            funciones.handleError(err,res);
        });
    }
};
//mostrar todos los empleados
module.exports.mostrarEmpleados = function(req, res){
    Empleado.find({activo:true,empresa:req.params.idEmpresa}).select("-clave").then(function(empleados){
        //muestro solo los roles activos
        empleados.map(function(empleado){
            rolesActivos = [];
            empleado.rol.map(function(e){
                if(e.activo)rolesActivos.push(e);
            });
            empleado.rol = rolesActivos;
        });
        res.status(200).json(empleados);
    }).catch(err =>{
        funciones.handleError(err,res);
    });
};
//mostrar todos los empleados
module.exports.mostrarEmpleadosCompleto = function(req, res){
    Empleado.find({empresa:req.params.idEmpresa}).select("-clave").then(function(empleados){
         res.status(200).json(empleados);
    }).catch(function(err){
        funciones.handleError(err,res);
    });
};
//mostrar un empleado
module.exports.mostrarEmpleado = function(req, res){
    var idEmpleado = req.params.idEmpleado;
    Empleado.findById(idEmpleado).select("-clave").then(function(empleado){
        if(!empleado){
            throw({
                statusCode:404,
                message:"not found"
            });
        }
        else{
            //muestro solo los roles activos
            rolesActivos = [];
            empleado.rol.map(function(e){
                if(e.activo)rolesActivos.push(e);
            });
            empleado.rol = rolesActivos;
            res.status(200).json(empleado);
        }
    }).catch(err =>{
        funciones.handleError(err,res);
    });
};
//actualizar empleado
module.exports.actualizarEmpleado = function(req, res){
    Empleado.findById(req.params.idEmpleado).select("-clave").then(function(empleado){
        if(!empleado){
            throw({
                statusCode:404,
                message:"not found"
            });
        }
        else{
            if(req.body.sucursal) empleado.sucursal = mongoose.Types.ObjectId(req.body.sucursal);
            if(req.body.celular) empleado.celular = req.body.celular;
            if(req.body.email) empleado.email = req.body.email;
            if(req.body.direccion) empleado.direccion = req.body.direccion;
            if(req.body.sexo) empleado.sexo = req.body.sexo;
            if(req.body.fechaNacimiento) empleado.fechaNacimiento = Date.parse(req.body.fechaNacimiento);
            if(req.body.empresa)empleado.empresa= req.params.idEmpresa;
            if(req.body.nombre)empleado.nombre= req.body.nombre;
            if(req.body.cargo)empleado.cargo=mongoose.Types.ObjectId(req.body.cargo);
            if(req.body.rol)empleado.rol= funciones._splitArray(req.body.rol).map(mongoose.Types.ObjectId);
            if(req.body.login)empleado.login=req.body.login;
            if(req.body.clave)clave= bcrypt.hashSync(req.body.clave);
            if(req.body.activo)empleado.activo = req.body.activo;
            if(req.body.horarioDias) {
                var dias = funciones._splitArray(req.body.horarioDias);
                var horarios = funciones._splitArray(req.body.horarios);
                var horario = [];
                for(i =0;i<horarios.length;i++){
                    horario.push({dia:dias[i],horario:horarios[i]});
                }
                empleado.horario = horario;
            }
            return empleado.save();
        }
    }).then(function(){
        console.log("second then");
        res.status(204).json();
    }).catch(function(err){
        funciones.handleError(err,res);
    });
}

//delete empleado
module.exports.borrarEmpleado = function(req, res){
    Empleado.findById(req.params.idEmpleado).then(function(empleado){
        if(!empleado){
            throw({
                statusCode:404,
                message:"not found"
            });
        }
        else{
            empleado.activo = false;
            empleado.save().then(function(){
                res.status(204).json();
            }).catch(function(err){
                console.log(err);
                res.status(500).json();
            });
        }
    }).catch(function(err){
        funciones.handleError(err,res);
    });
};
//login
module.exports.login = function(req, res) {
    if(!req.body.login || !req.body.clave){
        throw({
                statusCode:400,
                message:"missing data"
            });
    }
    
    var _id = req.params.idEmpresa +"-" + req.body.login;
    var clave = req.body.clave;
    Empleado.findById(_id).then(function(empleado){
        if(!empleado){
            throw({
                statusCode:404,
                message:"not found"
            });
        }
        else{
            if(bcrypt.compareSync(clave, empleado.clave)){
                console.log("empleado found :",empleado);
                
                var token = jwt.sign(
                    {
                        login: empleado.login,
                        idEmpresa: empleado.empresa
                    },
                    secret.word,
                    {
                        expiresIn: 3600
                    });
                // SUCCESS
                res
                    .status(200)
                    .json({
                    token: token
                });
                
            }
            else{
                throw({
                    statusCode:401,
                    message:"UNAUTHORIZED"
                });
            }
        }
    }).catch(function(err){
        funciones.handleError(err,res);
    });

};
// middleware to look for the authorization token in the request's header
module.exports.authenticate = function(req, res, next){
    var headerExists= req.headers.authorization;
    //authorization must come in header
    if(headerExists){
        var token = req.headers.authorization.split(' ')[1];
        
        var verify = promise.promisify(jwt.verify);
        
        verify(token,secret.word).then(function(decoded){
            if(req.params.idEmpresa && decoded.idEmpresa == req.params.idEmpresa) {next();} else {throw({                               statusCode:401,
                    message:"UNAUTHORIZED"
                });  
            };  
        }).catch(function(err){
            err.statusCode = 400;
            funciones.handleError(err,res);
        });
    }
    else{
        var err = {
            statusCode: 403,
            message:"missing token"
        };
        funciones.handleError(err,res);
    }
};
