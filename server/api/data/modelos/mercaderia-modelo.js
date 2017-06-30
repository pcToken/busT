var mongoose = require("mongoose");
var enums = require("../enums.js")
var mercaderiaSchema = new mongoose.Schema({
    empresa:{
        required:true,
        type: String
    },
    idLote:{
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:"Lote"
    },
    idArticulo:{
        required:true,
        type: mongoose.Schema.Types.ObjectId
    },
    idAlmacen:{
        required:true,
        type: mongoose.Schema.Types.ObjectId
    },
    ubicaciones:[{
        cantidad:Number,
        ubicacion:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Ubicacion"
        }
    }],
    estado:{
        type:String
    },
    precio:{
        type:Number
    },
    moneda:{
        type:String,
        enum:enum.monedaEnum
    },
    cantidad:{
        required:true,
        type: Number
    },
    cantidadVendida:{
        required:true,
        type: Number,
        default:0
    },
    datosExtra:mongoose.Schema.Types.Mixed,
    activo:{
        type:Boolean,
        default:true
    }
});