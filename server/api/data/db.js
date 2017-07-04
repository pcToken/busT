var mongoose = require('mongoose');
var dbUrl = 'mongodb://sholopolis:EstaBuenoElCafe@token-shard-00-00-lj4zz.mongodb.net:27017,token-shard-00-01-lj4zz.mongodb.net:27017,token-shard-00-02-lj4zz.mongodb.net:27017/datos?ssl=true&replicaSet=token-shard-0&authSource=admin';
var autoIncrement = require("mongoose-auto-increment");
// connect to data base
var connection = mongoose.connect(dbUrl);
//initialize auto-increment
autoIncrement.initialize(connection);

mongoose.connection.on("connected", function() {
    console.log("mongoose connected to " + dbUrl);
});

mongoose.connection.on("disconnected", function() {
    console.log("mongoose disconnected ");
});

mongoose.connection.on("error", function(error) {
    console.log("mongoose connection error " + error);
});

process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log("ctr C pressed");
        process.exit(0);
    });
});
require("./modelos/articulo-modelo.js");
require("./modelos/empresa-modelo.js");
require("./modelos/empleado-modelo.js");