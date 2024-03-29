var mongoose = require("mongoose");
var autoPopulate = require('mongoose-autopopulate');
var almacenSchema = new mongoose.Schema({
    empresa:{
        required:true,
        type: String
    },
    nombre:{
        type:String,
        required:true
    },
    direccion:{
        nombre:{
            type:String
        },
        pais:{
            type:String
        },
        ciudad:{
            type: String
        },
        calle:{
            type: String
        },
        referencia:{
            type: String
        },
        georef:{ 
            // LONG/LAT
            type: [Number],
            index: '2dsphere'
        }
    },
    ubicaciones:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Ubicacion',
        autopopulate:true
    }],
    activo:{type:Boolean, default:true}
});
var ubicacionSchema = mongoose.Schema({
    nombre:{
        type: String
    },
    descripcion:{
        type: String
    },
    cantidadMaxima:{
        type: Number
    },
    cantidadActual:{
        type: Number
    },
    cantidadActualHijos:{
        type:Number
    },
    padre:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Ubicacion"
    },
    hijos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Ubicacion",
        autopopulate:true
    }],
    activo:{
        type:Boolean,
        default:true
    }              
});
ubicacionSchema.plugin(autoPopulate);
almacenSchema.plugin(autoPopulate);

mongoose.model("Almacen",almacenSchema,"almacenes");
mongoose.model("Ubicacion",ubicacionSchema,"ubicaciones");