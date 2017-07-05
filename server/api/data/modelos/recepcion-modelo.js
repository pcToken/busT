var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var recepcionSchema = new mongoose.Schema({
    nro:{
        type:Number,
        required:true
    },
    empresa:{
        type:String,
        required:true
    },
    idCompra :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Compra"
    },
    fecha:{
        type:Date,
        required:true
    },
    idPago:{
        //ref to pagos in compra
        type: mongoose.Schema.Types.ObjectId
    },
    idAlmacen:{
        type: mongoose.Schema.Types.ObjectId
    },
    estado:String,
    observacion:String,
    foto:{
        foto:{
            type:String
        },
        descripcion:String
    },
    lotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lote"
    }],
    activo:{
        type:Boolean,
        default:true
    }
});
recepcionSchema.plugin(autoIncrement,{model:"Recepcion",startAt:1,field:"nro"});
mongoose.model("Recepcion",recepcionSchema,"recepciones");