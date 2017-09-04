var express = require('express');
var router = express.Router();
var config = require('./../config');


var mongojs = require('mongojs');

var db = mongojs(config.db);
//var db = mongojs('mongodb://user:password@ds161262.mlab.com:61262/sgrestaurant', ['restaurants']);
var ObjectID = mongojs.ObjectID;

router.get('/menuitem', function(req, res, next) {

  db.restaurants.find({} ,{ name:1 },function(err, restaurants) {
    if (err) {
      res.send(err);
    }
    res.json(restaurants);
    console.log(restaurants);
  });
});

// serve MenuCategory to Users
router.post('/servemenucat/:id', function(req, res, next){
//  db.restaurants.findOne({"_id" : mongojs.ObjectId(req.params.id)},{ "name":1,charg"menucategory":1, "menuitem":1},
  db.restaurants.findOne({"_id" : mongojs.ObjectId(req.params.id)},{ "name":1, "charge_gst" : 1, "menucategory":1, "menuitem":1},
function(err, servemenu){
  if(err){
    res.sent(err);
  }
  res.json(servemenu);
});
});

// serveMenuItem to users
router.post('/servemenuitems/:id', function(req, res, next) {
  var smenuitems = req.body;
  //var menuitems = smenuitems.passme;
  //console.log(menuitems.catid, menuitems.id);
  db.restaurants.aggregate([{$match : {"_id" : mongojs.ObjectId(req.params.id)}},
{$project:{
    menuitem:{$filter:{
        input: "$menuitem",
        as : "item",
        cond : {$eq: ["$$item.catid",smenuitems.catid]}}}}}], function(err, serveitems){
    if(err){
      res.sent(err);
    }
    res.json(serveitems);

  });


});

//create menuItem

router.post('/menuitem/:id', function(req, res, next) {

  var objectId = new ObjectID();
  var vmenuitem = req.body;
  var menucategory = vmenuitem.menucategory;
  console.log(menucategory);
  var isodate = new Date().toISOString()

  console.log("CREATING NEW menuItem " + vmenuitem);
  if (!vmenuitem) {
    res.status(400);
    res.json({
      "error": "MenuItem is Bad Data"
    });
  } else {

    db.restaurants.update({
      "_id": mongojs.ObjectId(req.params.id)
    }, {
      $addToSet: {

        "menuitem": {
          "_id": objectId,
          "item_name": vmenuitem.item_name,
          "menu_item_desc": vmenuitem.menu_item_desc,
          "item_price": vmenuitem.item_price,
          "menu_item_img": "",
          "catid": vmenuitem.catid,
          "catname": vmenuitem.catname,
          "lastmodifiedby": vmenuitem.lastmodifiedby,
          "currency": "SGD",
          "addgst" : vmenuitem.addgst,
          "is_item_available" : vmenuitem.menu_is_available,
          "lastmodifieddate": isodate

        }


      }
    }, function(err, restaurant) {
      if (err) {
        res.send(err);
        console.log(err);
      }
      res.json(restaurant);
      console.log("Menu Item Created " + restaurant);
    });
  }




});


module.exports = router;
