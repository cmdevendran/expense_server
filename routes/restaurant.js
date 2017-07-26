var express = require('express');
var router = express.Router();


var mongojs = require('mongojs');
var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', ['restaurants']);


// Get All Tasks
router.get('/restaurant', function(req, res, next) {

  db.restaurants.find({} ,{ name:1 },function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log(restaurants);
  });
});

// get restaurants for userid

router.get('/restaurant/:id', function(req, res, next) {
  //db.restaurants.findOne({"staff.staffid":"HMxFSQyw2QcXkRbCju1R0DLJA6x2", "staff.role":5})
  console.log("id : " + req.params.id);
  db.restaurants.findOne({
    "staff.staffid": req.params.id,
    "staff.role": 5
  }, {
    "name": 1,
    "menucategory": 1
  }, function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log("From get Restaurant menthod : "+restaurants);
  });

});

// ADD a menu Category

router.post('/restaurant/:id', function(req, res, next){

  var menuCategory = req.body;
    console.log("insid id : "+req.params.id);
      console.log("insid id : "+ menuCategory.menuCat1);
  //  console.log("insid menu category  : "+menuCategory.menuCat1.category);
  if(!menuCategory.menuCat1){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {

      //db.getCollection('restaurants').update({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {$push:{"menucategory":{"categoryname":"Breakfast"}}})
        //db.restaurants.update({"_id" : mongojs.ObjectId('596c31a3cd5b449992628cb1')},{$addToSet:{"menucategory":{"categoryname":menuCategory.menuCat}}}, function(err, restaurant){
  db.restaurants.update({"_id" : mongojs.ObjectId(req.params.id)},{$addToSet:{"menucategory":{"categoryname": menuCategory.menuCat1}}}, function(err, restaurant){
            if(err){
                res.send(err);
                console.log(err);
            }
            console.log("From POST Restaurant menthod : "+restaurant);
          //  db.getCollection('restaurants').find({"_id":ObjectId("596c31a3cd5b449992628cb1")}, {"menucategory.categoryname":1})
          db.restaurants.findOne({"_id": mongojs.ObjectId(req.params.id)}, {"name":1, "menucategory":1}, function(err, restaurants){
            // - dont need :db.restaurants.find({"staff.staffid": req.params.id, "staff.role":5}, {"menucategory.categoryname":1}, function(err, restaurants){
              if(err){
                res.send(err);
              }
              res.json(restaurants);
            console.log("From POST Restaurant menthod : "+restaurants);

        });
      });
    }


});


router.delete('/restaurant/:id')
module.exports = router;
