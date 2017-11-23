// Server.js is the entry point for the app

var express = require('express');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var mongojs = require('mongojs');
var ejwt = require('express-jwt');
var aws = require('aws-sdk');




var path = require('path');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var restaurant = require('./routes/restaurant');
var menuitem = require('./routes/menuitem');
var authenticate = require('./routes/authenticate');
//var sign = require('.routes/sign')

//var port = 8080;

var app = express();
var morgan = require('morgan');

	
//After lots of googling I decided to npm install express and add

app.set('port', (process.env.PORT || 5000));

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
app.use('/order', restaurant);
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

var AWS_ACCESS_KEY = config.AWSAccessKeyId;
var AWS_SECRET_KEY = config.AWSSecretKey;
var S3_BUCKET = config.storage;

app.get('/sign', function(req, res) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

  var s3 = new aws.S3()
  var options = {
    Bucket: S3_BUCKET,
    Key: req.query.file_name,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', options, function(err, data){
    if(err) return res.send('Error with S3')

    res.json({
      signed_request: data,
      url: 'https://s3.amazonaws.com/' + S3_BUCKET + '/' + req.query.file_name
    })
  })
});


app.listen(app.get('port'),function(){
    console.log('Server started on port '+app.get('port'));
});

module.exports = app;
