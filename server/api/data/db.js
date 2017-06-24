var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost:27017/datos';
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
require("./articulo-modelo.js");
require("./empresa-modelo.js");
require("./empleado-modelo.js");