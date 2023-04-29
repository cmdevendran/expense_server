var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');
var jwt    = require('jsonwebtoken');
//var User = require('./user');
var bcrypt = require('bcrypt');
const {MongoClient} = require('mongodb');
var session = require('express-session');
const { ReplSet } = require('mongodb');












var url = 'mongodb+srv://expense_admin:AVwC7jKLDsiZWVpz@expense-tracker.rjqyt.mongodb.net/expense_tracker?retryWrites=true&w=majority';

var db = mongojs(url);
var schema = mongojs.schema; 


var app = express();
app.set('superSecret', config.secret);

const client = new MongoClient(url);
client.connect();
//const dbo = client.db("expense_tracker");
//var MongoClient = require('mongodb').MongoClient;
//Connect to db:


// MongoClient.connect(config.db, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   dbo = db.db("expense_tracker");

 
// }); 
async function main(){
  const client = new MongoClient(config.db);
  try{  
    await client.connect();
    const dbo = client.db('expense_tracker');
    return dbo;

  }catch(error){
    console.log(error);

  }

}


  // Register user
  router.post('/rest/userregister', function(req, res) {
    console.log("within user-register mongodb");
    /*
    var new_user = new User({
      username: req.username
    });*/
    var username = req.body.username;
    var password = req.body.password;
    var FirstName = req.body.firstname;
    var LastName = req.body.lastname;
    console.log("username : "+req.body.username);
    console.log("password : "+req.body.password);

    var hashpassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    dbo.collection('user').findOne({username: username}, function(err, user) {
      if(err){
        console.log(err);
        return res.status(500).send();
      }
     // console.log("before  user : "+JSON.stringify(user));
      if (user) {
        return res.status(404).send("User Already Exist");
               
      } else{

        dbo.collection('user').insert({username : req.body.username,password : hashpassword, firstname : FirstName, lastname: LastName}, function(err, data){
          if(err){
            console.log(err);
            return res.status(500).send("User Registration Error");
          }
         // return res.status(200).send("User registered successfully"+ data);
         console.log(JSON.stringify(data));
         return res.status(200).send(data);
    
        })
      }

    
    });
  
   // new_user.password = new_user.generateHash(userInfo.password);
/*     db.user.insert({username : username, lastname : LastName, firstname : FirstName,password : hashpassword}, function(err, user){
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      return res.status(200).send();

    }); */
  });

  
  function requiresLogin(req, res, next) {
    console.log("requires login");
    if (req.session && req.session.userId) {
      console.log(req.session.userId);
      return next();
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }
//


// check login information
router.post('/rest/profile', requiresLogin, function(req, res, next) {
  //...

  dbo.collection('user').findOne({username: 'Deva'},{ password :1}, function(err, user) {
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    if (user) {
      
          return res.status(200).send(user._id);
        
        
    }
     
      //password did not match
    });
  });

  
// Login to Mongodb

  router.post('/rest/login',  async function(req, res,next) {
    await client.connect();
    const dbo = client.db("expense_tracker");
    var credentials = req.body;
    console.log(credentials);
    var username = req.body.username;
    var password = req.body.password;
   
    console.log(username + ' '+ password);
    if(username==null || password==null){
      console.log("username or password null");
      return res.status(500).send("username or password null");
    }
    var hashpassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    console.log(hashpassword);
   
   
   // const dbo = await main();
  // await dbservice.connect();
  const user = await dbo.collection('user').findOne({username:username},{password:1});
   
  if(user){
    const result = await bcrypt.compare(password,user.password);
    if(result){
      return res.send(user);

    }else{
      return res.send("Password does not match");

    }
  }else{
    return res.send("error in user");

  }
     // console.log(data);
  
  });
  



module.exports = router;
