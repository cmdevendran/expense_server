var express = require('express');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var mongojs = require('mongojs');
var ejwt = require('express-jwt');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)



var path = require('path');
var bodyParser = require('body-parser');
// test

var index = require('./routes/index');
var expense = require('./routes/expense');
var authenticate = require('./routes/authenticate');

//var port = 8080;

var app = express();
var morgan = require('morgan');

	//Access-Control-Allow-Headers
//After lots of googling I decided to npm install express and add

app.set('port', (process.env.PORT || 8080));

morgan.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});
app.use(morgan('combined'));

var db = mongojs(config.db,['expense_tracker']); // connect to database
app.set('superSecret', config.secret); // secret variable
//app.unless(jwt({secret:config.secret}).unless({path:['/api','/']}))  ;
var sess = {
  secret:  app.get('superSecret'),
  resave : false,
  saveUninitialized: false,
  cookie: {},
  store: new MongoStore({ url :  config.db })

}
 
if (app.get('env') === 'PROD') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies

}
 
app.use(session(sess));


//app.use(ejwt({ secret: app.get('superSecret')}).unless({path: ['/authenticate/']}));
// used for JWT token
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
  res.header("Access-Control-Allow-Headers", "Origin, session, X-Requested-With, Content-Type, Accept, Authorization");
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
app.use('/expense', expense);
app.use('/authenticate',authenticate);

//app.use('/api',router);


/*
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ /*});
server.listen(port, function(){
    console.log('Server started on port '+port);
});*/


app.listen(app.get('port'),function(){
    console.log('Server started on port '+app.get('port'));
    var isodate = new Date().toISOString();
   // console.log(isodate.toLocaleTimeString());
    console.log('Server started at  '+isodate.replace(/z|t/gi,' ').trim());
    
});

module.exports = app;
