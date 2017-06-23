var mongoose = require('mongoose');
var loteSchema = new mongoose.Schema({
    idEmpresa:{
        required:true,
        type: String
    },
    idCompra:{
        required:true,
        type: mongoose.Schema.Types.ObjectId
    },	
    fecha:Date,
    idPago:{
        required:true,
        type: mongoose.Schema.Types.ObjectId
    },
    idAlmacen:{
        required:true,
        type: mongoose.Schema.Types.ObjectId
    },
    recepcion:{
        IDPedido
        [IDArticulo]
        IdArticuloProv
        Cantidad
        Faltante
        Estado
        Observación
        IdUbicacion
    }
});