var mongoose = require("mongoose");


var detalleSchema = new mongoose.Schema({
    fotos : [{
        imagen: String,
        nombre: String,
        descripcion:String,
        activo : {type: Boolean, default: true}
    }],
    enlaces : [String],
    caracteristica : String
});

var articuloSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required : true
    },
    nombre : {
        type: String,
        required : true
    }, 
    empresa: {
        type: String,
        required : true
    },
    detalle : detalleSchema,
    //que tipo de embalaje es
    embalaje: {
        type: String,
        enum: ["caja", "paquete", "articulo", "parte", "subparte"]
    },
    //cantidad de producto dentro de embalaje
    cantidadPorPaquete : Number,
    //precio
    precio: {type:Number, required:true},
    moneda: {type: String, enum: ['bs','usd']},
    //cantidad disponible del articulo
    stock : {type: Number, required:true},
    //codigo del articulo que es padre de este articulo
    padre: String,
    hijos: [String],
    clasificacion: mongoose.Schema.Types.Mixed,
    activo : {type: Boolean, default: true}
});
mongoose.model('Articulo',articuloSchema);