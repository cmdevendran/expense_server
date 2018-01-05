var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var config = require('./../config');



var db = mongojs(config.db);
var ObjectID = mongojs.ObjectID;

// used to get the categories for expense form
router.post('/getcat/', function(req, res, next) {
    
 
    db.category.findOne({"name":"category"},{"categories":1},
    function(err, restaurants) {
        if (err) {
          res.send(err);
        }
        res.json(restaurants);
        console.log("From get Restaurant menthod : "+restaurants);
      });
   
  
  });

  router.post('/postexp/', function(req, res, next) {
    var expcat = req.body.expcat;
    var expdate = req.body.expdate;
    var expamount = req.body.expamount;
    var expremark = req.body.expremark;

    var isodate = new Date(expdate).toISOString();
    console.log("iso_expdate : "+isodate)
    db.expense_entries.insert({
        "expcat" : req.body.expcat,
        "expdate" : isodate,
        "expamount" : req.body.expamount,
        "expremark" : req.body.expremark
        
        },function(err, data) {
            if (err) {
              res.send(err);
            }
            res.json(data);
            console.log("From get Restaurant menthod : "+data);
          });
 
       
     
 
   
  
  });

  module.exports = router;