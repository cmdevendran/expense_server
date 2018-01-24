var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');



var db = mongojs(config.db);
var ObjectID = mongojs.ObjectID;

// used to get the categories for expense form
router.post('/getcat/', verifySession, function (req, res, next) {
  console.log("within getcat called");

  db.category.findOne({ "name": "category", "userid":req.headers.session }, { "categories": 1 },
    function (err, restaurants) {
      if (err) {
        res.send(err);
      }
      res.json(restaurants);
      console.log("From get Restaurant menthod : " + restaurants);
    });


});

function verfiyAuth(req, res, next) {
  console.log("Witin VerifyAuth " + JSON.stringify(req.headers));
  if (req.get('session')) {
    // add custom to your request object
    req._custom = req.get('session');
    console.log("Auuthorisatoin  header : " + JSON.stringify(req._custom));
    next();
  }
}
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



function requiresLogin(req, res, next) {
  console.log("requires login");

  console.log(JSON.stringify(req.headers));
  console.log(" req login : " + req.headers.session);

  if (req.session && req.session.userId) {
    console.log("console requires login : " + req.session.userId);
    console.log("console requires login : " + req.session);
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}

router.post('/postexp/',verifySession, function (req, res, next) {
  var expcat = req.body.expcat;
  var expdate = req.body.expdate;
  var expamount = req.body.expamount;
  var expremark = req.body.expremark;

  var isodate = new Date(expdate).toISOString();
  console.log("iso_expdate : " + isodate)
  db.expense_entries.insert({
    "expcat": req.body.expcat,
    "expdate": isodate,
    "userid":req.headers.session ,
    // "expamount" : req.body.expamount,
    // "expamount" : parseFloat(expamount),
    "expamount": Number(expamount),
    "expremark": req.body.expremark

  }, function (err, data) {
    if (err) {
      res.send(err);
    }
    res.json(data);
    console.log("From get Restaurant menthod : " + data);
  });






});

module.exports = router;