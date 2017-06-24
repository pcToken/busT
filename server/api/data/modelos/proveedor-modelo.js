var mongoose = require("mongoose");

var proveedorSchema = new mongoose.Schema({
    empresa:{
        type:String,
        required:true
    },
    nombre:String,
    abreviatura:String,
    nombreFactura:String,
    nit:String,
    fechaRegistro:Date,
    contactos:[{
        nombre:String,
        cargo:String,
        correo:String,
        celular:[String],
        telefono:[String]
    }],
    direcciones:[{
        nombre:String,
        pais:{
            type:String,
            enum:enums.paisEnum
        },
        ciudad:[{
            type:String,
            enum:enums.paisEnum
        }],
        calle:String,
        referencia:String,
        georef:{ 
            // LONG/LAT
            type: [Number],
            index: '2dsphere'
        }
    }],
    productos:[{
        idArticulo:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Articulo"
        },
        idArticuloProveedor:String
    }]
});
mongoose.model("Proveedor",proveedorSchema);