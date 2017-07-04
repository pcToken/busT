var db = require('./api/data/db.js');
var express = require("express");
var winston = require("winston");
var path  = require("path");
var routes = require(path.join(__dirname,"api","routes"));
var bodyParser = require('body-parser');
var ctrlEmpleado = require("./api/controladores/controlador-empleado.js");
var https = require("https");
var fs = require("fs");

//initialize
var app = express();

// Setup HTTPS
var options = {
  key: fs.readFileSync(path.join(__dirname,"private.key")),
  cert: fs.readFileSync(path.join(__dirname,"certificate.pem"))
};


//log all the requests
app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});
//configure logger 
winston.add(winston.transports.File,{
          filename: path.join(__dirname,'filelog-error.log'),
          level: "warning"
    });
console.log(path.join(__dirname,'filelog-error.log'));
//HTTPS
//app.use(function(req, res, next) {  
//  if(!req.secure) {
//    var secureUrl = "https://" + req.headers['host'] + req.url; 
//    res.writeHead(301, { "Location":  secureUrl });
//    res.end();
//  }
//  next();
//});

//use body parser for post requests
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// use routes from file route
app.use('/api', routes);

app.use('/node_modules', express.static(path.join(__dirname,'/../node_modules')));

//setting app port
app.set('port',(process.env.PORT || 5000))


//listen for requests in port
//var secureServer = https.createServer(options, app).listen(app.get("port"),function() {
//    var port  = app.get("port");
//    console.log("sirviendo en puerto: " + port);
//});
var server = app.listen(app.get('port'), function() {
    var port  = server.address().port;
    console.log("sirviendo en puerto: " + port);
});


