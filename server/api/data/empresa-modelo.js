var mongoose = require("mongoose");
var autoPopulate = require('mongoose-autopopulate');
var cargoSchema = new mongoose.Schema({
    esArea:Boolean,
    nombre:{
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    padre: {type: mongoose.Schema.Types.ObjectId,
            ref:'Cargo'
           },
    hijos: [{type: mongoose.Schema.Types.ObjectId,
            ref:'Cargo',
             autopopulate:true
           }],
    activo: {type:Boolean, default:true}
});
cargoSchema.index({nombre:1,empresa:1},{unique:true});
cargoSchema.plugin(autoPopulate);

var Cargo = mongoose.model('Cargo', cargoSchema);

var empresaSchema = new mongoose.Schema({
    //id sera abreviacion del nombre
    _id : {
        type : String,
        required : true
    },
    //nombre sera el nombre completo
    nombre:{
        type : String,
        required : true,
        unique : true
    },
    sucursal: [{
        nombreSucursal: String,
        ciudad: String,
        direccion: String,
        georef:{ 
            // LONG/LAT
            type: [Number],
            index: '2dsphere'
        },
        telefono: String,
        horario: [{
            dia:{type:String, enum:["lunes","martes","miercoles", "jueves", "viernes", "sabado","domingo"]},
            horario:String
        }],
        activo:{type:Boolean, default:true},
        email:String
    }],
    //referencia al primer nodo del organigrama
    gerenteGeneral: {type: mongoose.Schema.Types.ObjectId,
            ref:'Cargo'
           },
    activo:{type:Boolean, default:true}
    
});

mongoose.model("Empresa",empresaSchema);