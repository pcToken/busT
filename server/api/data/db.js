var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost:27017/datos';
// connect to data base
mongoose.connect(dbUrl);

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