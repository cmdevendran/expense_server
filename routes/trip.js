var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');



var db = mongojs(config.db);
var ObjectID = mongojs.ObjectID;


// USED to check the session is active or not. if session not available then most of things should not proceed.
function verifySession(req, res, next) {
  console.log(JSON.stringify(req.headers));
  console.log(" req login 1: " + req.headers.session);
  if (req.get('session')) {
    console.log(" req login 2 : " + req.headers.session);
    db.sessions.findOne({ "session": { $regex: req.headers.session } }, function (err, data) {
      if (err) {
        console.log("verify session within db.session " + err);
        err.status = 401;
        return next(err);
      }
      if (data == null) {
        console.log("verify session within db.session " + data);
        res.status = 401;
        return next(res);
      }


      console.log("verify session : " + JSON.stringify(data));
      return next();



    });
    //console.log("verify session 2 : "+JSON.stringify(data));

  } else {
    var err = new Error('You must have session in to view this page.');
    err.status = 401;
    return next(err);
  }
}

//  To record the Trips
router.post('/recordtrip/', verifySession, function (req, res, next) {

  db.trips.insert({
    userid: req.headers.session,
    tripdate: new Date(req.body.tripdate).toISOString(),
    tripclient: req.body.tripclient,
    tripfrom: req.body.tripfrom,
    tripto: req.body.tripto,
    tripfare: Number(req.body.tripfare),
    tripremark: req.body.tripremark
  }, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
    console.log("From trips : " + data);
  });






});

/**
 * 
 * to get the recent 10 trips
 * 
 */

router.post('/getrecenttrips/', verifySession, function (req, res, next) {

  var session = req.headers.session;
  console.log("within trips.." + session)

  db.trips.find({ 'userid': session }).limit(10).sort({ _id: -1 }, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
    console.log("getting recent trips : " + JSON.stringify(data));
  });

});

  /***
   * 
   *  Delete Trip
   * 
   * 
   */

  router.post('/deletetrip/', verifySession, function (req, res, next) {

    var session = req.headers.session;
    console.log("within trips.." + session)

    db.trips.remove({
      "_id": mongojs.ObjectId(req.body._id)
    }, function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);

    });




  });




module.exports = router;