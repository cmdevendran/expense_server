var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');
var jwt    = require('jsonwebtoken');
//var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', ['restaurants']);

var db = mongojs(config.db);
var app = express();
app.set('superSecret', config.secret);

/*
router.post('/:id', function(req, res,next) {

  // find the user
  db.users.findOne({"firebaseid":req.params.id, "active" : true, "blocked" : false},{"firebaseid":1}, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      // if user is found and password is right
      // create a token
        var token = jwt.sign(user,  app.get('superSecret'), {
          expiresIn: "30d" // expires in 24 hours
        });
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Authentication", token);

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'token',
          token: token
        });
      }



  });
});

router.get('/', function(req, res, next){
var auth =  req.get('Authentication');
console.log(auth);
if(auth){
  jwt.verify(auth, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        res.json({decoded});
        //next();
      }
    });
  }
});
*/
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



module.exports = router;
