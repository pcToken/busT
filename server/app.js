var db = require('./api/data/db.js');
var express = require("express");
var winston = require("winston");
var path  = require("path");
var routes = require(path.join(__dirname,"api","routes"));
var bodyParser = require('body-parser');
var ctrlEmpleado = require("./api/controladores/controlador-empleado.js");
//initialize
var app = express();

//log all the requests
app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

//use body parser for post requests
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// use routes from file route
app.use('/api', routes);

// use public folder as a static folder
app.use(express.static(path.join(__dirname,'/../client')));
app.use('/node_modules', express.static(path.join(__dirname,'/../node_modules')));

//setting app port
app.set('port',(process.env.PORT || 5000))


//listen for requests in port
var server = app.listen(app.get('port'), function() {
    var port  = server.address().port;
    console.log("sirviendo en puerto: " + port);
});
//configure logger 
winston.configure({
    transports: [
    new (winston.transports.File)({
          name: 'info-file',
          filename: 'filelog-info.log',
          level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'warning'
    })
  ]
});

