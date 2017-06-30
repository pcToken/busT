var mongoose = require("mongoose");
var autoPopulate = require("mongoose-autopopulate");
var enums = require("../enums.js");
//esquema para guardar los roles
var rolSchema = new mongoose.Schema({
    nombre: {
        type:String,
        required: true
    },
    empresa:{
        type: String,
        required: true
    },
    activo:{
        type: Boolean,
        default : true
    }
});
mongoose.model("Rol",rolSchema);

// esquema de empleado
var empleadoSchema  = new mongoose.Schema({
    _id: String,
    empresa:{
        type:String,
        required: true
    },
    sucursal:{
        type: mongoose.Schema.Types.ObjectId
    },
    nombre: {
        type: String,
        required: true
    },
    celular:String,
    email:String,
    direccion:String,
    sexo:{
        type: String,
        enum: enums.sexoEnum
    },
    fechaNacimiento: Date,
    horario:[{
        dia:{type:String, enum:enums.diasEnum},
        horario:String
    }],
    cargo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Cargo'
    },
    rol:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Rol',
        required: true,
        autopopulate: true
    }],
    login:  {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    activo:{type:Boolean, default : true}
});
empleadoSchema.plugin(autoPopulate);
mongoose.model("Empleado",empleadoSchema);