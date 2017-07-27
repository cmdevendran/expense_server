var express = require('express');



var path = require('path');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var restaurant = require('./routes/restaurant');

var port = 3001;

var app = express();



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', restaurant);
/*
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ /*});
server.listen(port, function(){
    console.log('Server started on port '+port);
});*/


app.listen(port,function(){
    console.log('Server started on port '+port);
});
