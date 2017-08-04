var express = require('express');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var mongojs = require('mongojs');
var ejwt = require('express-jwt');



var path = require('path');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var restaurant = require('./routes/restaurant');
var menuitem = require('./routes/menuitem');
var authenticate = require('./routes/authenticate');

var port = 3001;

var app = express();
var morgan = require('morgan');

morgan.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});
app.use(morgan('combined'));

var db = mongojs(config.db,['restaurants']); // connect to database
app.set('superSecret', config.secret); // secret variable
//app.unless(jwt({secret:config.secret}).unless({path:['/api','/']}))  ;



//app.use(ejwt({ secret: app.get('superSecret')}).unless({path: ['/authenticate/']}));

app.use("/", ejwt({
  secret : app.get('superSecret'),
  getToken: function fromCookie (req) {
    var token = req.params.get('id')|| req.params.get('ID');
      console.log("token in server.js : "+token + "super secret"+ app.get('superSecret'));
    if (token) {
      return token;
      console.log("tokessn in server.js : "+token + "super secret"+ app.get('superSecret'));
    }
    return null;
  }
}).unless({
    path:[
  //    '/authenticate/',
  //    '/'

    ]}
));


app.use(function(err, req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

if (err.name === 'UnauthorizedError') {
  return res.status(403).send({
    success: false,
    message: 'No token provided.'
  });
}

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



app.use('/',index);
app.use('/api', restaurant);
app.use('/menuitem', menuitem);
app.use('/authenticate',authenticate);

//app.use('/api',router);


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

module.exports = app;
