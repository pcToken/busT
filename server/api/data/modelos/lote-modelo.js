var mongoose = require('mongoose');
var loteSchema= new mongoose.Schema({
    nro:{
        type:Number,
        required:true
    },
    idPedido:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Compra.pedidos"
    },
    idArticulo:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Articulo"
    },
    idArticuloProveedor:{
        type: String        
    },
    cantidad:{
        type:Number,
        required:true
    },
    faltante:{
        type:Number
    },
    ubicaciones:[{
        cantidad:Number,
        ubicacion:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Ubicacion"
        }
    }],
    estado:String,
    observacion:String,
    activo:{
        type:Boolean,
        default:true
    }
});
loteSchema.plugin(autoIncrement,{model:"Lote",startAt:1,field:"nro"});
mongoose.model("Lote",loteSchema);