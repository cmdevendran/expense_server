var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');
var jwt    = require('jsonwebtoken');
//var User = require('./user');
var bcrypt = require('bcrypt-nodejs');
//var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', ['restaurants']);

var db = mongojs(config.db);
var schema = mongojs.schema;
var bcrypt = require('bcrypt-nodejs');

var app = express();
app.set('superSecret', config.secret);



// for Restaurant get rest id based on userid
router.post('/rest/getuserrest/:id',function(req, res, next){
  var id = req.params.id;
  console.log("insid id : " + id);

  if(id){
  db.users.findOne({firebaseid:id},{restaurantid:1 },
      function(err, restid) {
        if (err) {
          res.send(err);
          console.log(err);
        }
        res.json(restid);
        console.log("User order stopped " + restid);
      });
    }});

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

    var hashpassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  
   // new_user.password = new_user.generateHash(userInfo.password);
    db.user.insert({username : username, lastname : LastName, firstname : FirstName,password : hashpassword}, function(err, user){
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      return res.status(200).send();

    });
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

router.post('/rest/profile', requiresLogin, function(req, res, next) {
  //...

  db.user.findOne({username: 'Deva'},{ password :1}, function(err, user) {
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

  


  router.post('/rest/login', function(req, res) {
    var credentials = req.body;
    console.log(credentials);
    var username = req.body.username;
    var password = req.body.password;
    console.log(username + ' '+ password);
    if(username==null || password==null){
      console.log("username or password null");
      return res.status(500).send();
    }
    var hashpassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    console.log(hashpassword);
    db.user.findOne({username: username},{ password :1}, function(err, user) {
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      console.log("wrong user : "+JSON.stringify(user));
      if (user) {
        console.log(JSON.stringify(user));
        console.log(JSON.stringify(user.password));
        bcrypt.compare(password, user.password, function(err, data) {
          if(err){
            console.log(err);
          }
          if(data==true){
            //Authenticatio success
            req.session.userId = user._id;
           // return res.redirect('/profile');

            console.log(data);
            return res.status(200).send(user._id);
          }
          console.log(data);
          return res.status(404).send("password does not match");
          
      });
       
        //password did not match
      }
      else if(user==null){
        return res.status(404).send("No user found");
      }
     // console.log(data);
     
    });
  });
  



module.exports = router;
