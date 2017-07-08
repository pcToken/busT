var mongoose = require("mongoose");
var enums = require("../enums.js");
var autoPopulate = require('mongoose-autopopulate');
var idValidator = require("mongoose-id-validator");
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
        telefono:[String],
        activo:{
            type: Boolean,
            default : true
        }
    }],
    direcciones:[{
        nombre:String,
        pais:{
            type:String,
            enum: enums.paisEnum
        },
        ciudad:{     
            type:String,
            enum:enums.ciudadEnum
        },
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
            ref:"Articulo",
            autopopulate:true
        },
        idArticuloProveedor:String
    }],
    activo:{
        type: Boolean,
        default : true
    }
});
proveedorSchema.plugin(autoPopulate);
proveedorSchema.plugin(idValidator);
mongoose.model("Proveedor",proveedorSchema);