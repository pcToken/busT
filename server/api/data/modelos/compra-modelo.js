var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var idValidator = require("mongoose-id-validator");
var autoPopulate = require("mongoose-autopopulate");
var enums = require("../enums.js")

var compraPedidoSchema = mongoose.Schema({
        idArticulo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Articulo",
            required:true,
            autopopulate:{select:"nombre"}
        },
        idArticuloProveedor:String,
        
        cantidad:{
            type:Number,
            required:true
        },
        precioUnitario:{
            type:Number,
            required:true
        },
        importeSinDescuento:{
            type:Number,
            required:true
        },
        descuentos:[{
            importe:Number,
            concepto:String
        }],
        importe:{
            type:Number,
            required:true
        },
        moneda:{
            type:String,
            required:true,
            enum:enums.monedaEnum
        },
        activo:{
            type: Boolean,
            default : true
        }
    });
var compraPagoSchema = new mongoose.Schema({
        activo:{
            type: Boolean,
            default : true
        },
        fecha:Date,
        importe:{
            required:true,
            type:Number
        },
        moneda:{
            type:String,
            enum:enums.monedaEnum,
            required:true
        },
        saldo:{
            type:Number,
            required:true
        },
        nota:{
            nro:Number,
            foto:{
                descripcion:String,
                foto:String
            }
        },
        factura:{
            nro:Number,
            nit:String,
            fecha:Date,
            autorizacion:String,
            codigoControl:String,
            importe:Number,
            moneda:{
                type:Number,
                enum:enums.monedaEnum
            },
            foto:{
                descripcion:String,
                foto:String
            }
        }
    });

var compraSchema = new mongoose.Schema({
    activo:{
        type: Boolean,
        default : true
    },
    nro:{
        type:Number,
        required:true
    },
    empresa:{
        type:String,
        required:true
    },
    fecha:{
        type:Date,
        required:true
    },
    idProveedor :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Proveedor",
        autopopulate:{select:"nombre"}
    },
    importeSinDescuento:{
        required:true,
        type:Number
    },
    descuentos:[{
        importe:Number,
        concepto:String
    }],
    importe:{
        type:Number,
        required:true
    },
    moneda:{
        type:String,
        enum:enums.monedaEnum
    },
    saldoPago:{
        type:Number,
        required:true
    },
    estadoPago:{
        type:String
    },
    pagos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CompraPago",
        autopopulate:true
    }],
    pedidos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CompraPedido",
        autopopulate:true
    }],
    detalle:{
        usuarioCompra:{
            type:String,
            ref:"Empleado",
            autopopulate:{select:"nombre"}
        },
        proveedor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ProveedorContacto",
            autopopulate:true
        }
    }
});
compraSchema.plugin(autoIncrement.plugin,{model:"Compra",startAt:1,field:"nro",incrementBy:1});
compraSchema.plugin(idValidator);
compraSchema.plugin(autoPopulate)
mongoose.model("Compra",compraSchema);
mongoose.model("CompraPedido",compraPedidoSchema);
mongoose.model("CompraPago",compraPagoSchema);