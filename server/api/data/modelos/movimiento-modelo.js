var mongoose = require("mongoose");
var movimientoSchema = new mongoose.Schema({
    fecha:{
        required:true,
        type:Date
    },
    usuarioEntrega:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Empleado"
    },
    usuarioRecibe:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Empleado",
        required:true
    },
    idMercaderia:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"mercaderia"
    },
    ubicacionDestino:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Ubicacion"
    },
    cantidad:{
        required:true,
        type:Number
    }
});