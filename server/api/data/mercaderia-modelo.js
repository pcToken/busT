var mongoose = require("mongoose");
var mercaderiaSchema = new mongoose.Schema({
    idEmpresa:{
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
    idUbicacion:{
        required:true,
        type: mongoose.Schema.Types.ObjectId
    },
    activo:Boolean
});